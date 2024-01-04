import React, { useEffect, useState } from 'react';
import './App.css';
import CommunitiesHomes from './CommunitiesHomes';

export interface Community {
  id: string;
  name: string;
  imgUrl: string;
  group: string;
}

export interface Home {
  id: string;
  communityId: string;
  price: number;
  area: number;
  type: string;
}

function App() {
  let [ communities, setCommunities ] = useState<Community[]>( [] );
  let [ homes, setHomes ] = useState<Home[]>( [] );

  const [ loading, setLoading ] = useState( true );

  useEffect( () =>  {
    const fetchData = async () => {
      try {
        // fetch communities
        const comsResp = await fetch( 'https://storage.googleapis.com/openhouse-ai-fe-coding-test/communities.json' );
        const comsResult = await comsResp.json();
        setCommunities( comsResult );

        // fetch homes from the proxy server
        const homesResp = await fetch( 'https://storage.googleapis.com/openhouse-ai-fe-coding-test/homes.json' );
        const homesResult = await homesResp.json();
        setHomes( homesResult );
      } catch ( error ) {
        console.error ( `Error fetching data: `, error );
      } finally {
        setLoading( false );
      }
    };
    
    fetchData();
  }, [] );

  return (
    <div className="App">
      <header className="App-header">
        { loading ? null : 
          <CommunitiesHomes communities={ communities } homes={ homes }/>
        }
      </header>
    </div>
  );
}

export default App;
