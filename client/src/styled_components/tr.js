import styled from 'styled-components'

const TR = styled.tr`
    &:hover {
        cursor: ${props => props.header ? 'default' : 'pointer'};
        background-color: ${props => props.header ? '#f2f2f2' : 'rgb(133,187,101)'};
        color: ${props => props.header ? 'black' : 'white'};
    }
`

export default TR