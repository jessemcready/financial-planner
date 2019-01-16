import styled from 'styled-components'

const Header = styled.h1`
    font-size: 3em;
    font-weight: normal;
    flex-grow: ${props => props.flex ? '3' : '0' };
`

export default Header