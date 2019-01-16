import styled from 'styled-components'

const Row = styled.div`
    margin: auto;
    border-bottom: ${props => props.borderless ? 'none' : '2px solid black'};
    padding: 2em 0 2em 0;
    width: 75em;
    font-family: Helvetica, sans-serif;
    display: ${props => props.between || props.flex ? 'flex' : 'block'};
    justify-content: ${props => props.between ? 'space-evenly' : 'none'};
`

export default Row