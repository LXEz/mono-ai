import { Attributes, ComponentType } from 'react';

const ChatbotHOC = <T,>(WrappedComponent: ComponentType<T>) => {
  const EnhancedComponent = (props: T & Attributes) => {
    return <WrappedComponent {...props} />;
  };

  // Set the displayName for the HOC
  EnhancedComponent.displayName = `ChatbotHOC(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return EnhancedComponent;
};

export default ChatbotHOC;
