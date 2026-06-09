import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-navigation/native', () => {
  const React = require('react');

  return {
    NavigationContainer: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const navigation = {
    replace: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => {
        const firstScreen = React.Children.toArray(children)[0];
        const Component = firstScreen.props.component;
        return React.createElement(Component, { navigation });
      },
      Screen: () => null,
    }),
  };
});
