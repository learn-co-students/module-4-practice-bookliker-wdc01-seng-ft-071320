import React from "react";
import {
  Container,
  Header,
  Menu,
  Button,
  List,
  Image, FeedUser
} from "semantic-ui-react";

const url = "http://localhost:3000/books/"
class App extends React.Component{
  

  state = {
    books: [],
    currentBook: {},
  }

  componentDidMount(){

    fetch(url)
    .then(res => res.json())
    .then(books => this.setState({books}))
  }

  handleClick = (book) => {
    this.setState({
      currentBook: {...book, liked: false}
    })
  }

  handleLikeBtn = () => {

    let likeStatus = this.state.currentBook.users.some(user => user.id === 1)

    if (likeStatus === false){
      let newUsersArray = [...this.state.currentBook.users, {"id":1, "username":"pouros"}]
    
      let configObj = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          users: newUsersArray
        })
      }
  
      fetch(url + this.state.currentBook.id, configObj)
      .then(res => res.json())
      .then(book => {
        likeStatus = true

        this.setState({
          currentBook: {
            ...book,
            liked: likeStatus},
        })
      })


      
    } 

    else if (likeStatus == true){
      
      let newUsersArray = this.state.currentBook.users.filter(user => user.id !== 1)

    
      let configObj = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          users: newUsersArray
        })
      }
  
      fetch(url + this.state.currentBook.id, configObj)
      .then(res => res.json())
      .then(book => console.log(book))


      likeStatus = false

      this.setState({
        currentBook: {
          ...this.state.currentBook,
          users: newUsersArray,
          liked: likeStatus},
      })
      
    }
   
  }

  returnBoolLike = () => {
    if (this.state.currentBook.users){
      return this.state.currentBook.users.some(user => user.id === 1)
    }
    else{
      return false
    }
  }

  render(){
    const {title, description, img_url, users} = this.state.currentBook
    
    let likeBtnContent = null
    
    if (this.returnBoolLike()){
      likeBtnContent = "Unlike"
    }
    else{
      likeBtnContent = "Like"
    }

    return (
    <div>
      <Menu inverted>
        <Menu.Item header>Bookliker</Menu.Item>
      </Menu>
      <main>
        <Menu vertical inverted>
          {this.state.books.map(book => <Menu.Item onClick={() => this.handleClick(book)} as={"a"}>{book.title}</Menu.Item>)}
        </Menu>
        
        {users ? 
        <Container text>
          <Header>{title}</Header>
          <Image
            src={img_url}
            size="small"
          />
          <p>{description}</p>
          <Button
            onClick={this.handleLikeBtn}
            color="red"
            content = {likeBtnContent}
            icon="heart"
            label={{
              basic: true,
              color: "red",
              pointing: "left",
              content: "2,048"
            }}
          />
          <Header>Liked by</Header>
          <List>
            {users.map(user => <List.Item icon="user" content={user.username} />)}
          </List>
        </Container>
      : null}
      </main>
    </div>
  );
}
}

export default App;
