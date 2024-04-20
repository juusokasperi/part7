import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const CreateNew = (props) => {
  const { content: content, reset: resetContent } = useField('text')
  const { content: author, reset: resetAuthor } = useField ('text')
  const { content: info, reset: resetInfo } = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    props.setNotification(`New anecdote ${content.value} created!`)
    setTimeout(() => {
      props.setNotification('')
    }, 5000)
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
            content
          <input {...content} />
        </div>
        <div>
            author
          <input {...author} />
        </div>
        <div>
            url for more info
          <input {...info} />
        </div>
        <button>create</button>
        <input type="button" value="Clear" onClick={handleReset} />
      </form>
    </div>
  )

}

export default CreateNew