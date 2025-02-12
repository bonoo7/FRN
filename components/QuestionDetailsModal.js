import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../contexts/ThemeContext';
import { BackgroundPattern } from './BackgroundPattern';

const isLandscape = () => {
  const dim = Dimensions.get('window');
  return dim.width > dim.height;
};

const createStyles = (theme, isVisible, pressed) => {
  const dim = Dimensions.get('window');
  const isLandscapeMode = dim.width > dim.height;
  
  return StyleSheet.create({
    footer: {
      gap: SPACING.xs,
      paddingHorizontal: SPACING.xs,
      writingDirection: 'rtl',
      backgroundColor: `${theme.colors.background.surface}40`,
      padding: SPACING.xs,
      borderRadius: 8,
      width: '90%',
      maxWidth: Platform.OS === 'web' ? 600 : 500,
      alignSelf: 'center',
      marginTop: SPACING.xs,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SPACING.xs,
      width: '100%',
      paddingHorizontal: SPACING.sm,
    },
    footerItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    footerItemRight: {
      justifyContent: 'flex-end',
    },
    footerItemLeft: {
      justifyContent: 'flex-start',
    },
    footerLabel: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.medium,
      color: theme.colors.text.secondary,
      marginLeft: SPACING.xs,
    },
    footerValue: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.regular,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.xs,
    },
    modalContent: {
      width: '100%',
      maxWidth: Platform.OS === 'web' ? 700 : 600,
      height: Platform.OS === 'web' ? '80vh' : '80%',
      borderRadius: 16,
      borderWidth: 1,
      overflow: 'hidden',
      writingDirection: 'rtl',
      alignSelf: 'center',
      transform: [{ scale: isVisible ? 1 : 0.95 }],
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.2s ease',
    },
    container: {
      flex: 1,
      padding: SPACING.xs,
    },
    title: {
      fontSize: FONTS.sizes.h2,
      fontWeight: FONTS.weights.bold,
      textAlign: 'center',
      marginBottom: SPACING.xs,
      width: '100%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.xs,
      width: '90%',
      maxWidth: Platform.OS === 'web' ? 600 : 500,
    },
    headerDivider: {
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    mainContent: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: SPACING.sm,
      gap: SPACING.xs,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      marginVertical: SPACING.xs,
      backgroundColor: `${theme.colors.background.surface}20`,
      minHeight: Dimensions.get('window').width > Dimensions.get('window').height 
        ? 120 
        : Platform.OS === 'web' 
          ? 200 
          : 180,
      width: '90%',
      maxWidth: Platform.OS === 'web' ? 600 : 500,
      alignSelf: 'center',
    },
    detailRow: {
      alignItems: 'center',
      paddingVertical: 2,
      width: '100%',
      maxWidth: Platform.OS === 'web' ? 600 : 500,
      alignSelf: 'center',
    },
    rowText: {
      width: '100%',
      textAlign: 'right',
      writingDirection: 'rtl',
      marginBottom: 2,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    label: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.medium,
      color: theme.colors.text.secondary,
      minWidth: 120,
      textAlign: 'right',
    },
    value: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.regular,
      flex: 1,
      textAlign: 'right',
      marginRight: SPACING.sm,
    },
    largeLabel: {
      fontSize: FONTS.sizes.h3,
      fontWeight: FONTS.weights.bold,
      color: theme.colors.text.primary,
      minWidth: 100,
    },
    largeValue: {
      fontSize: FONTS.sizes.h3,
      backgroundColor: `${theme.colors.background.surface}40`,
      borderRadius: 8,
      padding: SPACING.xs,
      flex: 1,
      marginRight: SPACING.md,
      textAlign: 'right',
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    multilineValue: {
      lineHeight: 28,
      display: 'flex',
    },
    doublePoints: {
      padding: SPACING.xs,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 2,
      writingDirection: 'rtl',
      backgroundColor: `${theme.colors.success}33`,
    },
    doublePointsText: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      color: theme.colors.success,
    },
    closeButton: {
      padding: SPACING.xs,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
      width: '90%',
      maxWidth: Platform.OS === 'web' ? 600 : 500,
      alignSelf: 'center',
      transform: [{ scale: pressed ? 0.98 : 1 }],
      opacity: pressed ? 0.9 : 1,
    },
    closeButtonText: {
      color: '#FFFFFF',
      fontSize: FONTS.sizes.caption,
      fontWeight: FONTS.weights.bold,
    },
    questionLabelContainer: {
      position: 'absolute',
      top: SPACING.xs,
      right: SPACING.sm,
      zIndex: 1,
    },
    pointsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
    },
    pointsValue: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
    },
    pointsLabel: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.medium,
      color: theme.colors.text.secondary,
    },
    expandedText: {
      // Add appropriate styles for expanded text
    },
    infoCard: {
      backgroundColor: `${theme.colors.background.surface}30`,
      borderRadius: 8,
      padding: SPACING.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: `${theme.colors.border}50`,
    },
    infoCardLabel: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.medium,
      color: theme.colors.text.secondary,
      marginLeft: SPACING.xs,
    },
    infoCardValue: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      color: theme.colors.text.primary,
    },
    headerCards: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
      gap: SPACING.md,
      marginBottom: SPACING.md,
    },
    footerCards: {
      width: '90%',
      gap: SPACING.md,
    },
  });
};

const QuestionDetailsModal = ({ visible, onClose, details, theme }) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [pressed, setPressed] = useState(false);
  const styles = createStyles(theme, isVisible, pressed);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  if (!details) return null;

  const {
    question,
    answer,
    category,
    difficulty,
    answeredBy = 'لم يجب أحد',
    wasDoublePoints = false,
    earnedPoints = 0,
    answeredAt
  } = details;

  const formattedDate = answeredAt 
    ? new Date(answeredAt).toLocaleString('ar-SA')
    : 'غير معروف';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <BackgroundPattern
          style={[
            styles.modalContent,
            { 
              backgroundColor: `${theme.colors.background.card}F0`,
              borderColor: theme.colors.border
            }
          ]}
          patternId="modalPattern"
        >
          <View style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              تفاصيل السؤال
            </Text>

            <View style={styles.mainContent}>
              <View style={styles.detailRow}>
                <View style={styles.rowText}>
                  <Text style={[styles.largeLabel, { color: theme.colors.text.primary }]}>
                    السؤال:
                  </Text>
                  <Text style={[styles.largeValue, { color: theme.colors.text.primary }]}>
                    {question}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.rowText}>
                  <Text style={[styles.largeLabel, { color: theme.colors.text.primary }]}>
                    الإجابة:
                  </Text>
                  <Text style={[styles.largeValue, styles.multilineValue, { color: theme.colors.text.primary }]}>
                    {answer}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.footerRow}>
                <View style={[styles.footerItem, styles.footerItemRight]}>
                  <Text style={[styles.footerLabel, { color: theme.colors.text.secondary }]}>
                    الفئة:
                  </Text>
                  <Text style={[styles.footerValue, { color: theme.colors.text.primary }]}>
                    {category}
                  </Text>
                </View>
                <View style={[styles.footerItem, styles.footerItemLeft]}>
                  <Text style={[styles.footerLabel, { color: theme.colors.text.secondary }]}>
                    المستوى:
                  </Text>
                  <Text style={[styles.footerValue, { color: theme.colors.text.primary }]}>
                    {difficulty}
                  </Text>
                </View>
              </View>

              <View style={styles.footerRow}>
                <View style={[styles.footerItem, styles.footerItemRight]}>
                  <Text style={[styles.footerLabel, { color: theme.colors.text.secondary }]}>
                    أجاب عليه:
                  </Text>
                  <Text style={[styles.footerValue, { color: theme.colors.text.primary }]}>
                    {answeredBy}
                  </Text>
                </View>
                <View style={[styles.footerItem, styles.footerItemLeft]}>
                  <Text style={[styles.footerLabel, { color: theme.colors.text.secondary }]}>
                    النقاط:
                  </Text>
                  <Text style={[styles.footerValue, { color: theme.colors.text.primary }]}>
                    {earnedPoints}
                  </Text>
                </View>
              </View>

              {wasDoublePoints && (
                <View style={styles.doublePoints}>
                  <Text style={styles.doublePointsText}>
                    تم استخدام مضاعفة النقاط
                  </Text>
                </View>
              )}

              <View style={styles.footerRow}>
                <View style={[styles.footerItem, styles.footerItemRight]}>
                  <Text style={[styles.footerLabel, { color: theme.colors.text.secondary }]}>
                    تاريخ الإجابة:
                  </Text>
                  <Text style={[styles.footerValue, { color: theme.colors.text.primary }]}>
                    {formattedDate}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: theme.colors.primary }
              ]}
              onPress={handleClose}
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
            >
              <Text style={styles.closeButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </BackgroundPattern>
      </View>
    </Modal>
  );
};

export default QuestionDetailsModal;