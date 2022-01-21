import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, 
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal
} from 'reactstrap';


import {useState, useEffect} from 'react';
import React from 'react';
import fifa2 from './assets/fifa3.png';
import face from './assets/face.png';
import insta from './assets/insta.png';
import twitter from './assets/twitter.png';
import { Helmet } from 'react-helmet';


function App() {
    const [isOpen, setIsOpen] = React.useState(false);
    const baseUrl="https://localhost:44348/api/jogadores";
    const [data,setData]=useState([]);
    const [modalIncluir,setModalIncluir] =useState(false);

    const [jogadorSelecionado,setJogadorSelecionado]=useState({
      id:'',
      nome:'',
      posição:'',
      idade:'',
      timeAtual:'',
      valor:''
    })
    const selecionarJogador = (jogador,opcao) =>{
      setJogadorSelecionado(jogador);
      (opcao === "Editar") ?
        abrirFecharModalEditar() : abrirFecharModalExcluir();
    }
    const pedidoDelete=async() =>{
      await axios.delete(baseUrl+"/"+jogadorSelecionado.id)
      .then(response=>{
        setData(data.filter(jogador=>jogador.id !== response.data));
          abrirFecharModalExcluir();
      }).catch(error=>{
        console.log(error);
      })
    }

    const abrirFecharModalIncluir=()=>{
      setModalIncluir(!modalIncluir);
    }
    const  [modalEditar, setModalEditar] = useState(false);
    const  [modalExcluir, setModalExcluir] = useState(false);

    const abrirFecharModalEditar=()=>{
      setModalEditar(!modalEditar);
    }
 const abrirFecharModalExcluir=()=>{
   setModalExcluir(!modalExcluir)
 }

    const handleChange = e =>{
      const {name,value} = e.target;
      setJogadorSelecionado({
        ...jogadorSelecionado,[name]:value
      });
      console.log(jogadorSelecionado);
    }

    const pedidoGet = async ()=>{
      await axios.get(baseUrl)
        .then(response =>{
          setData(response.data);
        }).catch(error=>{
          console.log(error);
        })
    }
    const pedidoPost = async ()=>{
      delete jogadorSelecionado.id;
      jogadorSelecionado.idade=parseInt(jogadorSelecionado.idade);
      jogadorSelecionado.valor=parseInt(jogadorSelecionado.valor);
      await axios.post(baseUrl,jogadorSelecionado)
        .then(response =>{
          setData(data.concat(response.data));
          abrirFecharModalIncluir();
        }).catch(error=>{
          console.log(error);
        })
      }

        const pedidoPut = async() =>{
          jogadorSelecionado.idade=parseInt(jogadorSelecionado.idade);
          jogadorSelecionado.valor=parseInt(jogadorSelecionado.valor);
          await axios.put(baseUrl+"/"+jogadorSelecionado.id,jogadorSelecionado)
          .then(response=>{
            var resposta = response.data;
            var dadosAuxiliar = data;
            dadosAuxiliar.map(jogador=>{
              if(jogador.id===jogadorSelecionado.id){
                jogador.nome=resposta.nome;
                jogador.posição=resposta.posição;
                jogador.idade=resposta.idade;
                jogador.timeAtual=resposta.timeAtual;
                jogador.valor=resposta.valor;
              }
            });
            abrirFecharModalEditar();
          }).catch(error=>{
            console.log(error);
          })
        
      
        }

    useEffect(()=>{
      pedidoGet();
    })
  
    return (
        <div style={{ display: 'block', flex:1}}>
          <div>
          <Helmet>
            <title>FIFA Brasil</title>
          </Helmet>

          </div>
          <Navbar color="light" light >
              <NavbarBrand href="/"></NavbarBrand>
              <img src={fifa} style={{width:80, height:30, marginTop:10,marginBottom:10}}></img>
              <NavbarToggler onClick={() => { setIsOpen(!isOpen) }} />
              <Collapse isOpen={isOpen} navbar>
                  <Nav className="mr-auto" navbar>
                      <NavItem>
                          <NavLink href="#">Home</NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink href="#">Login</NavLink>
                      </NavItem>
                  </Nav>
              </Collapse>
          </Navbar>
          <div style={{flex:1,backgroundColor:'#0263bc', height:100}}>
            <br></br>
            <h2 style={{textAlign:'center', color:'white',}}>GERENCIAR JOGADORES</h2>
          </div>
          
        <div>
          <br/>
          <button className='btn btn-success' onClick={()=>abrirFecharModalIncluir()} style={{marginTop:20, marginBottom:20}}>Incluir Novo Jogador</button>
        </div>
        <table className='table table-bordered'>
          <thead style={{backgroundColor:'#0263bc', color:'white'}}>
            <tr>
            <th>Id</th>
            <th>Nome do Jogador</th>
            <th>Posição</th>
            <th>Idade</th>
            <th>Time Atual</th>
            <th>Valor</th>
            <th>Ações</th>
            </tr>
          </thead>
          <tbody style={{backgroundColor:'#f7f9fc'}}>
            {data.map(jogador=>(
              <tr key={jogador.id}>
                <td>{jogador.id}</td>
                <td>{jogador.nome}</td>
                <td>{jogador.posição}</td>
                <td>{jogador.idade}</td>
                <td>{jogador.timeAtual}</td>
                <td>{jogador.valor}</td>
                <td style={{alignItems:'center',verticalAlign:'middle',textAlign:'center'}}>
                  <button className='btn btn-primary' style={{verticalAlign:'middle'}} onClick={()=> selecionarJogador(jogador,"Editar")}>Editar</button>
                  <button className='btn btn-danger' style={{marginLeft:20}} onClick={()=> selecionarJogador(jogador,"Excluir")}>Excluir</button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>

        <Modal isOpen={modalIncluir}>
          <ModalHeader style={{justifyContent:'center'}}>Incluir Jogador</ModalHeader>
          <ModalBody>
              <div className='form-group'>
                <label>Nome</label>
                <br></br>
                <input type="text" className="form-control"  name='nome' onChange={handleChange}/>
                <br></br>
                <label>Posição</label>
                <br></br>
                <input type="text" className="form-control" name='posição' onChange={handleChange}/>
                <br></br>
                <label>Idade</label>
                <br></br>
                <input type="number" className="form-control"name='idade' onChange={handleChange}/>
                <br></br>
                <label>Time Atual</label>
                <br></br>
                <input type="text" className="form-control" name='timeAtual' onChange={handleChange}/>
                <br></br>
                <label>Valor</label>
                <br></br>
                <input type="number" className="form-control" name='valor' onChange={handleChange}/>
                <br></br>
              </div>
          </ModalBody>
          <ModalFooter style={{justifyContent:'center'}}>
                  <button className='btn btn-danger' onClick={()=>abrirFecharModalIncluir()} style={{marginLeft:20}}>Cancelar</button>
                  <button className='btn btn-primary'onClick={()=>pedidoPost()} style={{width:90}}>Incluir</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEditar}>
          <ModalHeader style={{justifyContent:'center'}} >Editar Jogador</ModalHeader>
          <ModalBody>
            <div className='form-group'>
              <label>ID:</label>  
              <input type="text" className="form-control"  name='nome' onChange={handleChange}  readOnly value= {jogadorSelecionado && jogadorSelecionado.id}/>
              <br/>
              <label>Nome</label>
                <br></br>
                <input type="text" className="form-control"  name='nome' onChange={handleChange}  value= {jogadorSelecionado && jogadorSelecionado.nome}/>
                <br></br>
                <label>Posição</label>
                <br></br>
                <input type="text" className="form-control" name='posição' onChange={handleChange}  value= {jogadorSelecionado && jogadorSelecionado.posição}/>
                <br></br>
                <label>Idade</label>
                <br></br>
                <input type="number" className="form-control"name='idade' onChange={handleChange}  value= {jogadorSelecionado && jogadorSelecionado.idade}/>
                <br></br>
                <label>Time Atual</label>
                <br></br>
                <input type="text" className="form-control" name='timeAtual' onChange={handleChange}  value= {jogadorSelecionado && jogadorSelecionado.timeAtual}/>
                <br></br>
                <label>Valor</label>
                <br></br>
                <input type="number" className="form-control" name='valor' onChange={handleChange}  value= {jogadorSelecionado && jogadorSelecionado.valor}/>
                <br></br>
            </div>
          </ModalBody>
          <ModalFooter style={{justifyContent:'center'}}>
                  <button className='btn btn-danger' onClick={()=>abrirFecharModalEditar()} style={{marginLeft:20}}>Cancelar</button>
                  <button className='btn btn-primary'onClick={()=>pedidoPut()} style={{width:90}}>Editar</button>
         </ModalFooter>
        </Modal>
        <footer style={{backgroundColor:'#000f2c', display:'flex', height:150, marginTop:80,alignItems:'center',justifyContent:'center'}}>
          <img src={fifa2} style={{width:80, height:30, marginBottom:50}}></img>
          <br></br>
          <div style={{position:'absolute', marginBottom:20}}>
             <img src={insta} style={{width:38, height:38 , marginTop:100, marginRight:5}}></img>
             <img src={face} style={{width:40, height:40, marginTop:100, marginRight:5}}></img>
             <img src={twitter} style={{width:35, height:35, marginTop:100}}></img>
          </div>
        </footer>

        <Modal isOpen={modalExcluir}>
          <ModalBody>
            Você realmente quer excluir?
          </ModalBody>
          <ModalFooter style={{justifyContent:'center'}}>
                  <button className='btn btn-primary' onClick={()=>abrirFecharModalExcluir()} style={{marginLeft:20}}>Voltar</button>
                  <button className='btn btn-danger'onClick={()=>pedidoDelete()} style={{width:90}}>Excluir</button>

          </ModalFooter>


        </Modal>


      </div >
       
        
     
      
  );
}

export default App;
