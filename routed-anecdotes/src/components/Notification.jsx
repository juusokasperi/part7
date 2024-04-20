const Notification = ({ notification }) => {
  if (notification === '') {
    return null
  } else {
    return (
      <div>{notification}</div>
    )
  }
}

export default Notification