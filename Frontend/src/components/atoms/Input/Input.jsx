import { forwardRef } from 'react'

const Input = forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} />
})

export default Input
