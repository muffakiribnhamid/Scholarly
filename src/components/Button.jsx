import React from 'react';
import styled from 'styled-components';

const Button = ({ content = "Enter", handleClick, disabled }) => {
  // Split the content into individual characters
  const letters = content.split('');
  
  return (
    <StyledWrapper>
      <button 
        onClick={handleClick}
        disabled={disabled}
        className={disabled ? 'disabled' : ''}
      >
        <span className="span-mother">
          {letters.map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </span>
        <span className="span-mother2">
          {letters.map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    font-weight: bold;
    color: white;
    border-radius: 2rem;
    cursor: pointer;
    min-width: 95px;
    height: 42.66px;
    border: none;
    background-color: #3653f8;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1.5rem;
    transition: all 0.2s ease;
    
    &:hover:not(.disabled) {
      background-color: #2941d4;
      transform: translateY(-1px);
    }

    &.disabled {
      background-color: #a0a0a0;
      cursor: not-allowed;
      transform: none;
    }
  }

  button .span-mother {
    display: flex;
    overflow: hidden;
  }

  button:hover:not(.disabled) .span-mother {
    position: absolute;
  }

  button:hover:not(.disabled) .span-mother span {
    transform: translateY(1.2em);
  }

  button .span-mother span {
    transition: 0.2s;
  }

  button .span-mother span:nth-child(2) {
    transition: 0.3s;
  }

  button .span-mother span:nth-child(3) {
    transition: 0.4s;
  }

  button .span-mother span:nth-child(4) {
    transition: 0.5s;
  }

  button .span-mother span:nth-child(5) {
    transition: 0.6s;
  }

  button .span-mother2 {
    display: flex;
    position: absolute;
    overflow: hidden;
  }

  button .span-mother2 span {
    transform: translateY(-1.2em);
  }

  button:hover:not(.disabled) .span-mother2 span {
    transform: translateY(0);
  }

  button .span-mother2 span {
    transition: 0.2s;
  }

  button .span-mother2 span:nth-child(2) {
    transition: 0.3s;
  }

  button .span-mother2 span:nth-child(3) {
    transition: 0.4s;
  }

  button .span-mother2 span:nth-child(4) {
    transition: 0.5s;
  }

  button .span-mother2 span:nth-child(5) {
    transition: 0.6s;
  }`;

export default Button;
