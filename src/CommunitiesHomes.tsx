import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './App.css';
import { Community, Home } from './App';
import { useState } from 'react';

interface Props {
    communities: Community[];
    homes: Home[];
}

interface CommunitiesAndHomes {
    community: Community;
    homes: Home[]
}

const CommunitiesHomes = ( props: Props ) => {

    function createData(
        id: string,
        imageUrl: string,
        name: string,
        group: string,
        averagePrice: number,
        lowestPrice: number,
        homes: Home[] = [],
    ) {
        return {
            id,
            imageUrl,
            name,
            group,
            averagePrice,
            lowestPrice,
            homes: homes.map( (home ) => ( {
                id: home.id,
                type: home.type,
                price: home.price,
                area: home.area,
            } ) ),
        };
    }

      function Row(props: { row: ReturnType<typeof createData> }) {
        const { row } = props;
        const [ open, setOpen ] = useState( false );
      
        return (
          <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              { /** Collapse Button */}
              <TableCell size='small'> 
              { row.homes.length ? 
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton> : null
              }
              </TableCell>
              { /* Name and Image */}
              <TableCell align="center" style={ { display: `flex`, flexDirection: `column`, alignItems: `center` } } component="th" scope="row"> 
                <div className={ `community-name` }>{row.name}</div>
                <a href={ `http://maps.google.com/?q=Calgary ${ row.name }` } target={ `_blank` }>
                    <img 
                        style={ { width: '125px', height: '125px', objectFit: 'cover', borderRadius: '10px' } } 
                        src={ row.imageUrl }
                        alt="Community Image"
                    />
                </a>
              </TableCell>
              { /* Group */}
              <TableCell align="center">{row.group}</TableCell>
              { /* Average Price */}
              <TableCell align="center">
                {   
                    row.averagePrice ?
                        row.averagePrice.toLocaleString('en-US', { style: 'currency', currency: 'CAD'} ) :
                            null
                }
              </TableCell>
              { /* Lowest Price */}
              <TableCell align="center">
                {   
                    row.lowestPrice !== Infinity ? 
                        row.lowestPrice.toLocaleString('en-US', { style: 'currency', currency: 'CAD'} ) :
                            null
                }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Homes
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          { /* Collapsed Headers: Type, Area, Price */}
                          <TableCell>Type</TableCell>
                          <TableCell align="right">Area (sqft)</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.homes.map( ( homeRow ) => (
                          <TableRow key={ homeRow.id }>
                            <TableCell component="th" scope="row">
                              { homeRow.type }
                            </TableCell>
                            <TableCell align="right">{ homeRow.area}</TableCell>
                            <TableCell align="right">{ homeRow.price.toLocaleString('en-US', { style: 'currency', currency: 'CAD'} ) }</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </>
        );
      } 
    
      /**
       * helper function to provide rows for the table to process
       * calculates average price and lowest price as well
       */
      const createRows = ( communities: Community[], homes: Home[] ) => {
        const communitiesAndHomes = combineCommunitiesAndHomes( communities, homes );

        const rows = communitiesAndHomes.map( ( communityAndHomes ) => {
            // calculate the average price
            const averagePrice = communityAndHomes.homes.reduce( ( totalPrice, home ) => {
                return totalPrice + home.price;
            }, 0 ) / communityAndHomes.homes.length;
            
            const lowestPrice = communityAndHomes.homes.reduce( ( lowestPrice, home ) => {
                return home.price < lowestPrice ? home.price : lowestPrice;
            }, Infinity );

            // process rows
            return createData( 
                communityAndHomes.community.id,
                communityAndHomes.community.imgUrl, 
                communityAndHomes.community.name, 
                communityAndHomes.community.group, 
                averagePrice,
                lowestPrice,
                communityAndHomes.homes
            );
        } );

        return rows;
      };

      /**
       * helper function to combine the communities and home objects
       * sorts both and then groups the in their respective communities
       */
      function combineCommunitiesAndHomes ( communities: Community[], homes: Home[] ) {
        // sort communities by name first
        const sortedCommunities = communities.sort( ( a, b ) => a.name.localeCompare( b.name ) );

        // sort homes by price
        const sortedHomes = homes.sort( ( a, b ) => a.price - b.price )

        // combine the two properties in a new object
        const communitiesAndHomes: CommunitiesAndHomes[] = sortedCommunities.map( ( comm ) => {
            return { community: comm , homes: [] }
        } );

        // add homes to communities
        sortedHomes.forEach( ( home ) => {
            communitiesAndHomes.find( comm => comm.community.id === home.communityId )?.homes.push( home );
        } );

        return communitiesAndHomes;
      }
      
      function CollapsibleTable() {
        return (
          <TableContainer component={ Paper }>
            <Table stickyHeader aria-label="collapsible table">
              <TableHead style={ { backgroundColor: 'grey' } }>
                <TableRow>
                  { /* Column Headers: Name, Group, Average Price, Lowest Price */ }
                  <TableCell />
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Group</TableCell>
                  <TableCell align="center">Average Price</TableCell>
                  <TableCell align="center">Lowest Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { createRows( props.communities, props.homes ).map( ( row ) => (
                  <Row key={ row.id } row={ row } />
                ) ) }
              </TableBody>
            </Table>
          </TableContainer>
        );
      }

    return (
        <div className={ `frosted-glass` }>
            <CollapsibleTable/>
        </div>
    );
};

export default CommunitiesHomes;