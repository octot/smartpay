import { React, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    marginTop: '-140px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));
const WhatsAppSender = ({ resultToWhatsapp }) => {
  console.log("data of resultToWhatsapp ",resultToWhatsapp)
  const classes = useStyles();
  const to = '+918714596258'; 
  // const to = '+919567831387'; 
  const [status, setStatus] = useState('');
  const [lastSentTime, setLastSentTime] = useState(null);
  const sendMessage = () => {
    if (lastSentTime !== null) {
      // Check if sending another message exceeds the rate limit
      const elapsed = Date.now() - lastSentTime;
      if (elapsed < 1000) { // 1 second rate limit
          setTimeout(sendMessage, 1000 - elapsed);
          return;
      }
  }
    sendRequest();
  };
  const sendRequest = () => {
    fetch('https://smartpay-1.onrender.com/send-whatsapp', { // Adjusted port to 4000
    // fetch('http://localhost:4000/send-whatsapp', { // Adjusted port to 4000
    method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: resultToWhatsapp, to }),
    })
      .then(response => response.json())
      .then((data) => {
        console.log("response from api data ",data)
        if (data.success) {
          // alert("Success!!!");
          setStatus(data.message);
          setLastSentTime(Date.now()); // Update last sent time
        } else {
          // alert("Error!!!");
          setStatus(`Error sending message "${data.message}`);
        }
      })
      .catch(error => {
        alert("Error!!!");
        setStatus(`Error from whtsappSender : ${error.message}`);
      });
  };
  useEffect(() => {
    sendMessage();
  }, [resultToWhatsapp]);
  return (
    <div>
      <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
        <Grid item>
          <Typography variant="body1">{status}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default WhatsAppSender;
