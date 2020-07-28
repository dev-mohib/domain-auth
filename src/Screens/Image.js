import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Navigation from './Navigation'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
export default function SimpleTable() {
    const [ready, setReady ] = React.useState(false)
    const classes = useStyles();
    const [imageUri, setImageUri] = React.useState('')
    const [name, setName] = React.useState('')
    const [data, setData] = React.useState([])
React.useEffect(() => {
    const image_id = window.location.search.substring(1)
    fetch(`https://elasticsearch.mizaharsiv.org/elasticsearch/archive/_doc/${image_id}`, 
  {
    method: "GET",
    headers: {
     "Content-Type" : "application/json"
    }
  })
    .then(response => response.json())
    .then(result => {
    console.log("JSON " + result._source)
     setImageUri(result._source.mediaLink)
     setName(result._source.artist)
     setData((prevData) => [...prevData, {name : "Image Name", value : result._source.name}])
     setData((prevData) => [...prevData, {name : "Image Artist", value : result._source.artist}])
     setData((prevData) => [...prevData, {name : "Image Description", value : result._source.imageDescription}])
     setData((prevData) => [...prevData, {name : "Object Name", value : result._source.objectName}])
     setData((prevData) => [...prevData, {name : "Date Time", value : result._source.dateTimeOriginal}])
     setData((prevData) => [...prevData, {name : "Media Link", value : result._source.mediaLink}])
     setData((prevData) => [...prevData, {name : "Caption", value : result._source.caption}])
     setReady(true)
    })
    .catch(error => {
     console.log("Error Occured")
    });
  
  },[])
if(ready)
  return (
    <>
     <Navigation />
     <h1>Image Information</h1>
     <img src={imageUri} alt={imageUri} />
     <Card className={classes.root}>
      <CardContent>
        <Typography style={{fontSize : 22, fontWeight : 'bold'}} variant="body2" color="textSecondary" component="p">
          {name}
        </Typography>
      </CardContent>
    </Card>
    <hr /><br /> 
  <Container>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Property</TableCell>
            <TableCell align="right">Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              {/* <TableCell align="right">{row.name}</TableCell> */}
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>
  </>
  ) 
  else
  return(<div>Loading Image...</div>)
}