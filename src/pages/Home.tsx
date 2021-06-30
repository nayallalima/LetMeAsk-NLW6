import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { database } from '../services/firebase';

import googleIconImg from '../assets/google-icon.svg';
import illustrationImg from '../assets/illustration.svg';
import logoImg from '../assets/logo.svg';

import '../styles/auth.scss';

export function Home(){
    const history = useHistory();    
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom(){
        if(!user){
          await signInWithGoogle();
        }
        history.push('/rooms/new');            
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if(roomCode.trim() === ''){
            return;
        }
        
        const roomRef = await database.ref(`/rooms/${roomCode}`).get();

        if(!roomRef.exists()){
            alert('Room does not exists.');
            return;
        }

        if (roomRef.val().endedAt) {
            alert('Room already closed.');
            return;
        }

        history.push(`/rooms/${roomCode}`);        
    }

    return(
        <div id="page-auth" >
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta</strong>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>
            <main>                
                <div className="main-content">
                    <img src={logoImg} alt="Logo da Letmeask" />
                    <h2>{user?.name}</h2>
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie uma sala com o Google
                    </button>
                    <div className="separator"> ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                        type="text" 
                        placeholder="Digite o código da sala"
                        onChange={event => setRoomCode(event.target.value)}
                        value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>                    
                </div>                
            </main>
        </div>
    )
}