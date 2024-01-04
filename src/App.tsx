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
        const commsResp = await fetch( 'https://storage.googleapis.com/openhouse-ai-fe-coding-test/communities.json' );
        const commsData = await commsResp.json();

        // light validation on communities api
        if ( commsData && typeof commsData === 'object' ) {
          setCommunities( commsData );

        } else {
          throw new Error('Invalid data format');
        }

        // fetch homes from the proxy server
        const homesResp = await fetch( 'https://storage.googleapis.com/openhouse-ai-fe-coding-test/homes.json' );
        const homesData = await homesResp.json();

        // light validation on homes api
        if ( homesData && typeof homesData === 'object' ) {
          setHomes( homesData );
        }

        setHomes( homesData );
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
          <>
            <h1 style={ { textShadow: 'black -2px 2px 0px' } }>Communities</h1>
            <CommunitiesHomes communities={ communities } homes={ homes }/>
          </>
      }
      </header>
    </div>
  );
}

export default App;
