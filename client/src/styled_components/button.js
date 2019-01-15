import styled from 'styled-components'

const Button = styled.button`
    height: 3em;
    font-size: 1em;
    margin-top: 1em;
    padding: 0.25em 1em;
    border-radius: 3px;
    width: 100%;
    border: ${props => props.delete ? '2px solid red' : '2px solid green'};
    color: ${props => props.delete ? 'red' : 'green'};
    background: white;

    &:hover {
        color: white;
        background: ${props => props.delete ? 'red' : 'green' };
        border: 2px solid white;
    }
`

export default Button