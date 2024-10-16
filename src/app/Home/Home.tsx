import * as React from 'react';

const Home: React.FunctionComponent = () => {
  React.useEffect(() => {
    document.title = `PatternFly React Seed | Home`;
  }, []);

  return <div>Hello world</div>;
};

export { Home };
