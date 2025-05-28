import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { collection, doc, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase-config';
import {onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';

function App() {
  //auth
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    if(currentUser !== null){
      var addBook = document.getElementById("add-book");
      var settings = document.getElementById("change-settings");
      var delBook = document.getElementsByClassName(user.uid);
      if(addBook)
        addBook.hidden = false;
      if(settings)
        settings.hidden = false;
      for (let element of delBook){
        element.hidden = false;
      }
    }
  })

  const login =  async() => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user);
    } catch(error){
      console.log(error.message);
      alert(error.message);
    }
  };
  const logout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  //crud
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newLocal, setNewLocal] = useState("");
  const [newISBN, setNewISBN] = useState("");
  const [newAdress, setNewAdress] = useState("");
  const [newSchedule, setNewSchedule] = useState("");
  const [newUser, setNewUser] = useState("");
  const [livros, setLivros] = useState([]); //buscar lista de livros
  const livrosCollRef = collection(db, "livros");


  //mapeamento
  const mapeamento = {
    testUser : {
      userID: "-",
      userInst: "testUser",
      userAdress: "Endereço Teste - Porto Alegre - RS",
      userSchedule: "De seg. à sex. 09h30m - 12h"
    },
    testUser2: {
      userID: "-",
      userInst: "testUser2",
      userAdress: "Endereço Teste 2 - Porto Alegre - RS",
      userSchedule: "Sáb e Dom. 15h20m - 20h"
    }
  };
  function getInst(uID){
    if(uID == mapeamento.testUser.userID){
      return mapeamento.testUser.userInst;
    }
    else if(uID == mapeamento.testUser2.userID){
      return mapeamento.testUser2.userInst;
    }
  }



  //deletar livro
  const deleteBook = async (id) => {
    const bookDoc = doc(db, "livros", id);
    await deleteDoc(bookDoc);
    window.location.reload();
  }

  //criar livro
  const createBook = async () => {
    await addDoc(livrosCollRef, {
      usuario: user.uid,
      título: newTitle,
      autor: newAuthor,
      genero: newGenre,
      ISBN: newISBN,
      endereco: newAdress,
      horarios: newSchedule,
      disponibilidade: true,
      instituicao: newLocal,
      sinopse: ""
    })
    window.location.reload();
  };
  //função executa qd pagina renderiza
  useEffect(() => {
    const getLivros = async () => {
      const data = await getDocs(livrosCollRef);
      setLivros(data.docs.map((doc) =>({...doc.data(), id: doc.id})))
    }

    getLivros();
  }, [])


  return <div className='App'>
    <nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
        <form class="d-flex">
          <h4 class="display-10">iLivro</h4>
          <span>&nbsp;</span>
          <input id="login-email" class="form-control me-2" placeholder='Usuário' 
          onChange={(event) => {setLoginEmail(event.target.value)
          }}/>
          <input id="login-password" class="form-control me-2" type="password" placeholder='Senha'
          onChange={(event) => {setLoginPassword(event.target.value); 
          }}/>
          <button id="btn-login" type="button"onClick={login} class="btn btn-outline-secundary">Entrar</button>
          <button id="btn-logout" type="button"onClick={logout} class="btn btn-outline-secundary">Sair</button>
          <span>{user?.email}</span>
        </form>
      </div>
    </nav>
    <div id="add-book" class='container' hidden="true">
        <input placeholder= "Título" onChange={(event) => {setNewTitle(event.target.value)}}/>
        <input placeholder= "Autor" onChange={(event) => {setNewAuthor(event.target.value)}}/>
        <input placeholder= "Gênero" onChange={(event) => {setNewGenre(event.target.value)}}/>
        <input placeholder= "ISBN" onChange={(event) => {setNewISBN(event.target.value)}}/>
        <input placeholder= "Endereço" onChange={(event) => {setNewAdress(event.target.value)}}/>
        <input placeholder= "Horários" onChange={(event) => {setNewSchedule(event.target.value)}}/>
        <input placeholder= 'Instituição' onChange={(event) => {setNewLocal(event.target.value)}}/>
        <button class="btn btn-secondary" onClick={createBook}>Adicionar Livro</button>
      </div>
      {livros.map((livro) => {
      return <div>
                <div class ="card text-center">
                  <div class="card-header">
                    <h5 class="card-title">{livro.título}</h5>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">Gênero: {livro.genero}</h5>
                    <h5 class="card-title">Autor: {livro.autor}</h5>
                  </div>
                  <div class="card-footer text-body-secondary">
                    Disponível em: {livro.instituicao} | Endereço: {livro.endereco} | {livro.horarios}
                    <br></br><span class={livro.usuario} hidden="true">{livro.ISBN}  </span><button class={livro.usuario} id="del-btn" hidden="true" onClick={() => {deleteBook(livro.id)}}>Retirar</button>
                  </div>
                </div>

                  
                <div>&nbsp;</div>
        
        </div>})}</div>
      

}



export default App;
