import React, { useState, useEffect } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const myState = useSelector((state) =>  state.usersInformation);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    var url = 'https://reqres.in/api/users';
    var urlArray = [];
    axios.get(url)
      .then((res) => {
        var total_page = res.data.total_pages;
        var no_user_per_page = res.data.per_page;
        for (var i=1; i<=total_page; i++){
          urlArray.push(url+'?page='+i);
        }
        for (var j=0; j<total_page; j++){
          console.log(urlArray[j]);
        }
        
        var tot_res = [];
        var cnt = 0;
        Promise.all(
          urlArray.map(url => 
            fetch(url)
            .then(response => response.json())
            .then(responseData => {
              var onionarray = [];
              onionarray = JSON.parse(JSON.stringify(responseData));
              for(var l=0; l<no_user_per_page; l++){
                tot_res.push(onionarray.data[l]);
                console.log(onionarray.data[l]);
              }
              cnt++;
              if(cnt===total_page){
                dispatch({ data: JSON.parse(JSON.stringify(tot_res)), type: 'getUsersInfo' });
                setLoading(false);
              }
            })
          )
        )
      }).catch(err => console.log(err));

  }, []);

  const getUserData = (id) => {
    console.log(id);
    axios.get('https://reqres.in/api/users/' + id)
      .then((res) => {
        setUserData(res?.data?.data);
      }).catch(err => console.log(err));
  }

  return (
    <div className="App">
        {loading &&
        <div>
          <p>Loading Users Information...</p>
          <input type="text" value={myState}/>
        </div>
        }

        {!loading &&
        <div>
          <div>
            <div>
              {userData &&
                <div className="userBox">
                  <div>
                    <img className="userPic" src={userData?.avatar} alt="" />
                  </div>
                  <div className="middle">
                    <div>
                      <h2 className='header'>{userData?.first_name + " " + userData?.last_name}</h2>
                      <p>{userData?.email}</p>
                    </div>
                  </div>
                </div>
              }

              {!userData &&
                <>
                  <div>
                    <div>
                      <h2>Click on any Button</h2>
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
          <div class="btn-group">
            {myState?.map((res, btn) => (
              <div className="btn" key={btn} onClick={() => getUserData(res?.id)}>
                {btn + 1}
              </div>
            ))
            }
          </div>
        </div>
        }
    </div>
  );
}

export default App;
