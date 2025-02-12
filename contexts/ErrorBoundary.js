import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            عذراً، حدث خطأ ما. الرجاء المحاولة مرة أخرى.
          </Text>
          <TouchableOpacity 
            onPress={() => this.setState({ hasError: false })}
            style={styles.retryButton}
          >
            <Text>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 