import styled from 'styled-components'

const Row = styled.div`
    border-bottom: ${props => props.borderless ? 'none' : '2px solid black'};
    padding: 2em 0 2em 0;
    font-family: Helvetica, sans-serif;
`

export default Row