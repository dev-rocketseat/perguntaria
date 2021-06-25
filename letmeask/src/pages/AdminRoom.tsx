import { useHistory, useParams } from 'react-router-dom';
import { UseRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
//Components
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// Assets
import logoImg from '../assets/images/logo.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import deleteImg from '../assets/images/delete.svg';
import '../styles/room.scss';

type RoomsParams = {
  id: string
};

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomsParams>();
  const roomId = params.id;
  const { questions, title } = UseRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir está pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    };
  }

  async function handleCheckQuestionAnswer(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <img src={logoImg} alt="Perguntaria" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={() => {
              handleEndRoom()
            }}>Encerrar Sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className='room-title'>
          <h1>Treinamento: {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>
        <div className='question-list'>
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type='button'
                      onClick={() => { handleCheckQuestionAnswer(question.id) }}
                    >
                      <img src={checkImg} alt='Focar Mensagem' />
                    </button>
                    <button
                      type='button'
                      onClick={() => { handleHighlightQuestion(question.id) }}
                    >
                      <img src={answerImg} alt='Responder Mensagem' />
                    </button>
                  </>
                )}
                <button
                  type='button'
                  onClick={() => { handleDeleteQuestion(question.id) }}
                >
                  <img src={deleteImg} alt='Apagar Mensagem' />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}