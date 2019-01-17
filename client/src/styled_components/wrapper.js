import styled from 'styled-components'

const Wrapper = styled.div`
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: center;
    align-items: baseline;
    width: ${props => props.width || 'auto'}
`

export default Wrapper;