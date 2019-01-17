import styled from 'styled-components'

const ListItem = styled.li`
    font-size: 1.5em;
    margin-right: ${props => props.logo ? 'auto' : '0'};
    padding: 1em;

    &:hover {
        cursor: pointer;
        color: rgb(133,187,101);
    }
`

export default ListItem 

