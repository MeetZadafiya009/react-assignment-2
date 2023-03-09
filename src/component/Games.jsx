import React, { useEffect, useState } from 'react'

function Games() {
    const [data,setData] = useState([]);
    const [total,setTotal]=useState();
    const [items,setItem]=useState([]);
    const [platformSet, setPlatform] = useState([]);
    const [tmp, setTmp] = useState(true);
    let platform = [];
    useEffect(() => {
        if (tmp) {
            fetchAllGames();
        }
    }, []);
    const fetchAllGames = async () => {
        let response = await fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json');
        let result = await response.json();
        setData(result);
        setTotal(result.length);
        setItem(result);
        setPlatform(platforms(result));
    }
    const sortPlatform = (value) => {
        setTmp(false);
        setData(getSortedData(value));
    }
    const platforms = (item) => {
        platform = [];
        item.forEach((v) => {
            if (v.platform) {
                platform.push(v.platform);
            }
        });
        return Array.from(new Set(platform));
    }
    const getSortedData = (value) => {
        let array = items.filter((v) => {
            return v.platform == value;
        });
        setTotal(array.length);
        return array;
    }
    const searchHandler=(search)=>{
        setTmp(false);
        setData(getSearchData(search));
    }
    const getSearchData=(search)=>{
        let regEx=new RegExp(`${search}`,'gi');
        let array=items.filter((item)=>{
            if(item.title){
                return item.title.match(regEx) || item.platform.match(regEx) || item.genre.match(regEx);
            }
        });
        setTotal(array.length);
        return array;
    }
    let renderList = data.map((game, index) => {
        if (game.title) {
            return (
                <div key={index} className='col-xxl-3 col-xl-4 col-md-6 mb-4'>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{game.title}</h5>
                            <p className="card-text">Platform : {game.platform}</p>
                            <p className='card-text'>Genre : {game.genre}</p>
                            <button className="btn btn-primary me-3">Score : {game.score}</button>
                            <button className={game.editors_choice == 'Y' ? "btn btn-success" : "btn btn-danger"}>Editor Choice</button>
                        </div>
                    </div>
                </div>
            )
        }
    })
    return (
        <>
            <header>
                <div className="container">
                    <div className="row py-5">
                        <div className="col-6">
                            <select onChange={(e) => sortPlatform(e.target.value)} className='form-select'>
                                {
                                    platformSet.map((v, index) => {
                                        return <option key={index} value={v}>{v}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-6">
                            <input type="text" onChange={(e)=>searchHandler(e.target.value)} className='form-control' placeholder='Search Games' />
                        </div>
                    </div>
                </div>
            </header>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <p>showing {total} result</p>
                        </div>
                    </div>
                    <div className="row">
                        {renderList}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Games;