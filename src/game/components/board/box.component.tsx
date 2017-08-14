import * as React from 'react';
import styled from 'styled-components';

interface Props {
  box: string;
  boxSize: number;
}

function Box(props: Props) {
  console.log('Box')
  const Icon = styled.i`
    font-size: ${props.boxSize}px;
    
    &::before {
      margin: 0;
    }
  `;
  return props.box ?
    <Icon className={`icon-${props.box}`}> </Icon> :
    <div style={{ width: props.boxSize, height: props.boxSize }} />;
}

export const BoxComponent = Box;
