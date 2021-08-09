import React, {useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);


function App() {

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] =  useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //User has logged in...
        console.log(authUser);
        setUser(authUser);
      }else{
        //user has logged out...
        setUser(null);
        
      }
    })

    return() => {
      //perform some cleanup actions
      unsubscribe();
    }

  }, [user, username]);

  //useEffect -> Runs a piece of code based on a specific conditions

  useEffect(() => {
    //This is where code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //Every time a post is added, this code fires..
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);
  
  const signUp = (event) => {
      event.preventDefault();
      
      auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        window.location.reload();
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

     setOpenSignIn(false); 
  }

  return (
    <div className="app">
      
      <Modal
        open={openSignIn}
        onClose= {() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        
            <form className="app__signup">
                  <center>
                      <img 
                        className="app__headerImage" 
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                        alt="Instagram-logo" />
                  </center>
                        
                        <Input
                          placeholder="Email"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                          placeholder="Password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button type="submit" onClick={signIn}>Sign In</Button>
            </form>
        
        </div>

      </Modal>


      <Modal
        open={open}
        onClose= {() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        
            <form className="app__signup">
                  <center>
                      <img 
                        className="app__headerImage" 
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                        alt="Instagram-logo" />
                  </center>
                        <Input
                          placeholder="Username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        
                        <Input
                          placeholder="Email"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                          placeholder="Password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button type="submit" onClick={signUp}>Sign Up</Button>
            </form>
        
        </div>

      </Modal>
      
      <div className="app__header">
          <img 
            className="app__headerImage" 
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
            alt="Instagram-logo" />

        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ): (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
          
        )}  
      </div>
      
      {/*Header*/}
      {/*Posts*/}
      <div className="app__posts">
        <div className="app_postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app_postsRight">
            <InstagramEmbed
              url='https://www.instagram.com/p/CQOD38Cjv6G/'
              clientAccessToken='2991250021201892|b3f6ab8647303dc08c783540af9b4797'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
        </div>
      </div>
      
      



      {user?.displayName ? (
          <ImageUpload username={user.displayName}/>
      ): (
          <h3>Sorry you need to login to upload</h3>
      )}

    </div>
  );
}

export default App;
