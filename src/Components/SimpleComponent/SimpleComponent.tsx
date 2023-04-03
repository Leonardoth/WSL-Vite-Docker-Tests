import Button, { ButtonProps } from '@mui/material/Button'

interface SimpleComponentProps extends ButtonProps{

}

export default function SimpleComponent(props : SimpleComponentProps) {
  return (
    <Button variant='outlined' {...props}>This is a button</Button>
  )
}
