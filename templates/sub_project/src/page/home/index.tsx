import React from 'react';
import './index.scss';
import { Basicpage } from 'leo-design';

const PREFIX = 'home';
const HomePage = () => {
  return (
    <Basicpage className={PREFIX}>
      <div className={`${PREFIX}-main`}>
        <h1> Hello world! </h1>
      </div>
    </Basicpage>
  );
};

export default HomePage;
