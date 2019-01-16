import styled from 'styled-components'

const Form = styled.form`
    display: flex;
    justify-content: space-evenly;
    flex-direction: ${props => props.vert ? 'column' : 'row' };
    margin-top: ${props => props.vert ? '35%' : 'auto' };
`

export default Form