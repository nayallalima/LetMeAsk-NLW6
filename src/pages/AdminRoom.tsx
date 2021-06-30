import {useHistory, useParams} from 'react-router-dom';

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { database } from '../services/firebase';

import logoImg from '../assets/logo.svg';
import deleteImg from '../assets/delete.svg';
import checkImg from '../assets/check.svg';
import answerImg from '../assets/answer.svg';

import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom'

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory()
    const params = useParams<RoomParams>();    
    const roomID = params.id;
    const {title, questions} = useRoom(roomID);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomID}`).update({
          endedAt: new Date(),
        })
    
        history.push('/');
    }
    
    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomID}/questions/${questionId}`).update({
          isAnswered: true,
        })
    }
    
    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomID}/questions/${questionId}`).update({
          isHighlighted: true,
        })
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
          await database.ref(`rooms/${roomID}/questions/${questionId}`).remove();
        }
    } 

    return (
        <div id='page-room'>
            <header>
                <div className='content'>
                    <img src={logoImg} alt='Logo do Letmeask' />
                    <div>
                        <RoomCode code={roomID}/>
                        <Button isOutLined onClick={handleEndRoom}> Encerrar sala </Button>
                    </div>
                </div>
            </header>

            <main className='content'>
                <div className='room-title'>
                    <h1> Sala   {title} </h1>
                    { questions.length>0 && <span> {questions.length} pergunta(s) </span>}
                </div>                

                <div className='question-list'>
                {questions.map(question => {
                    return(
                        <Question
                        key={question.id}
                        content = {question.content}
                        author = {question.author}
                        isAnswered={question.isAnswered}
                        isHighlighted={question.isHighlighted}
                        >
                            {!question.isAnswered && (
                                <>
                                <button
                                    type="button"
                                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                    >
                                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleHighlightQuestion(question.id)}
                                    >
                                    <img src={answerImg} alt="Dar destaque à pergunta" />
                                </button>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                                >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Question>    
                    );
                })}
                </div>            
            </main>
        </div>
    );
}