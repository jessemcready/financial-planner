import styled from 'styled-components'

const TR = styled.tr`
    &:hover {
        cursor: ${props => props.header ? 'default' : 'pointer'};
        background-color: ${props => props.header ? 'white' : 'green'};
        color: ${props => props.header ? 'black' : 'white'};
    }
`

export default TR