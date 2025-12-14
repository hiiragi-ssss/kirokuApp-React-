import { useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// string方式のtimeInputを数字の分に変換する
function timeToMinute(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
}
// 数字の分をstring方式に変換する
function minuteToTime(minute) {
  const h = String(Math.floor(minute / 60)).padStart(4, "0");
  const m = String(minute % 60).padStart(2, "0");
  return `${h}:${m}`;
}

// 保存した名前と時間を描画するコンポーネント
// propsで受け取ったAppの要素を反映させていく
function Plate(props) {
  // props.plateはオブジェクトを渡されている{id,name,minute}
  const time = minuteToTime(props.plate.minute);

  // 削除ボタン用
  const handleDeleteClick = () => {
    props.onDeleteClick(props.plate.id);
  };

  return(
    <>
      <section className="plate">
        <div className="name">{props.plate.name}</div>
        <div className="time">{time}</div>
        <button className="deleteButton" onClick={handleDeleteClick}>削除</button>
      </section>
    </>
  );
}

// 登録場所を描画するコンポーネント
const RecordForm = (props) => {
  // 入力されたnameとtimeの保存場所
  const [nameInput, setNameInput] = useState('');
  const [timeInput, setTimeInput] = useState('');

  // inputに入力された文を描画する
  const handleNameChange = (e) => {
      setNameInput(e.currentTarget.value);
  }
  const handleTimeChange = (e) => {
      setTimeInput(e.currentTarget.value);
  }

  // 登録ボタンが押されたらエラーを出すか、inputの値を描画するためにsetする
  const handleOnAdd = (e) => {
    e.preventDefault();
    if (nameInput === `` && timeInput === ``) {
        alert(`名前と時間が入力されていません`);
        return false;
    }
    if (nameInput === ``) {
        alert(`名前が入力されていません`);
        return false;
    }
    if (timeInput === ``) {
        alert(`時間が入力されていません`);
        return false;
    }
    props.onAdd(nameInput, timeInput);
    setNameInput('');
    setTimeInput('');
  }

  return (
      <>
        <section className="record">
            <input
            className="name"
            type="text"
            // 値
            value={nameInput}
            // 変化が起きたら
            onChange={handleNameChange}
            />
            <input
            className="time"
            type="time"
            value={timeInput}
            onChange={handleTimeChange}
            />
            {/* ボタンが押されたら */}
            <button className="recordButton" onClick={handleOnAdd}>登録</button>
        </section>
      </>
  );
}

// 全体を描画する場所、最終的にここに集約するし、propsをつけて必要な値を配っている
function App() {
  const [plates, setPlates] = useState([]);

// ローカルストレージの用意、読み込み
  useEffect(() => {
      let savedPlates;
      if (localStorage.getItem('plates') === null) {
          savedPlates = [];
      }else{
          savedPlates = JSON.parse(localStorage.getItem('plates'));
      }
      setPlates(savedPlates);
    }, [])

    const updatePlates = (newPlates) => {
        setPlates(newPlates);
        localStorage.setItem('plates', JSON.stringify(newPlates));
    };

    //nameとtimeが入力されていたら登録ボタンを押したときに追加される
      const handleAddRecord = (name, timeStr) => {
        const minute = timeToMinute(timeStr);
        const newPlates = [...plates];
        const exist = newPlates.find((x) => x.name === name);

        if(exist){
          const updated = newPlates.map((x) => {
            return x.name === name
              ? { ...x, minute: x.minute + minute }
              : x;
          });
          updatePlates(updated);
          return;
        }else{
          // オブジェクトを生成して配列にpush
          newPlates.push({
              id: Date.now(),
              name: name,
              minute: minute,
          });
        }
        updatePlates(newPlates);
    };

    // 削除ボタン用
    const handlePlateDeleteClick = (id) => {
        if(!window.confirm('削除しますか？')) {
            return;
        }
        const newPlates = plates.filter((palate) => {
            return palate.id !== id;
        });
        updatePlates(newPlates);
    };

    // plateが配列状なので展開
    const plateItems = plates.map((plate) => {
    return (
        <Plate
            key={plate.id}
            plate={plate}
            onDeleteClick={handlePlateDeleteClick}
        />
        );
    });

    // 全体のコンポーネントをまとめる
  return (
    <>
      <main>
        <RecordForm onAdd = {handleAddRecord} />
        {plateItems}
      </main>
    </>
  );
}

export default App;

