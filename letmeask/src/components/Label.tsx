
type LabelProps = {
  text?: number
}

export function Label(props:LabelProps){
  return(
    <div>
      <p>{props.text}</p>
    </div>   
  )
}