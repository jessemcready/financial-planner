import styled from 'styled-components'
import Button from './button'

const CancelButton = styled(Button)`
    color: orange;
    border: 2px solid orange;
    flex: 1 1 5%;

    &:hover {
        color: white;
        background: orange;
        border: 2px solid white;
    }
`

export default CancelButton