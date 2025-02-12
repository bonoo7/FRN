import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Modal, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from 'expo-router';

export const TeamsHeader = ({ 
  teams = [], 
  currentTeamIndex = 0, 
  scores = {}, 
  onTeamChange, 
  onScoreChange,
  onEndRound, 
  isDoublePoints, 
  onDoublePointsChange, 
  usedDoublePoints = {}
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 768;
  
  const validTeams = Array.isArray(teams) ? teams : [];
  const validScores = typeof scores === 'object' ? scores : {};
  const validDoublePoints = typeof usedDoublePoints === 'object' ? usedDoublePoints : {};

  const getScoreColor = (score) => {
    if (score > 0) return theme.colors.success;
    if (score < 0) return theme.colors.error;
    return theme.colors.text.secondary;
  };

  if (!theme) {
    return null;
  }

  if (!validTeams.length) {
    console.log('No valid teams found');
    return null;
  }

  const handleTeamSelect = (index) => {
    if (onTeamChange) {
      onTeamChange(index);
      setShowTeamSelector(false);
    }
  };

  const handleEndRound = () => {
    onEndRound();
  };
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingTop: 4,
      paddingBottom: 8,
      minHeight: 70,
      position: 'relative',
    },
    endRoundButton: {
      position: 'absolute',
      left: SPACING.sm,
      top: '50%',
      transform: [{ translateY: -20 }],
      backgroundColor: theme.colors.error,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 100,
      ...Platform.select({
        web: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
        default: {
          elevation: 3,
        }
      })
    },
    endRoundButtonText: {
      color: theme.colors.text.light,
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      textAlign: 'center',
    },
    teamsScroll: {
      width: '100%',
      paddingHorizontal: 40,
    },
    teamsContainer: {
      flexGrow: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 8,
      paddingVertical: SPACING.xs,
    },
    teamCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: isSmallScreen ? 8 : 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginHorizontal: 2,
      minWidth: isSmallScreen ? 90 : 110,
      maxWidth: isSmallScreen ? 130 : 160,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: `${theme.colors.background.surface}F0`,
      ...Platform.select({
        web: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        default: {
          elevation: 2,
        }
      })
    },
    activeTeamCard: {
      transform: [{ scale: 1.02 }],
      borderColor: theme.colors.primary,
      borderWidth: 2,
      ...Platform.select({
        web: {
          boxShadow: `0 4px 12px ${theme.colors.overlay}`,
        }
      })
    },
    teamMainContent: {
      flex: 1,
      alignItems: 'center',
    },
    teamName: {
      fontSize: isSmallScreen ? 14 : 16,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 2,
      textAlign: 'center',
    },
    scoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: theme.colors.background.card,
      padding: 3,
      borderRadius: 6,
      width: '100%',
    },
    scoreButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scoreButtonMinus: {
      backgroundColor: theme.colors.error,
    },
    scoreButtonPlus: {
      backgroundColor: theme.colors.success,
    },
    scoreButtonText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.colors.text.light,
    },
    scoreText: {
      fontSize: 16,
      fontWeight: 'bold',
      minWidth: 30,
      textAlign: 'center',
      color: theme.colors.text.primary,
    },
    doubleButton: {
      width: 30,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
      marginLeft: 4,
    },
    doubleButtonActive: {
      backgroundColor: theme.colors.success,
    },
    doubleButtonDisabled: {
      backgroundColor: '#E0E0E0',
      opacity: 0.8,
    },
    doubleButtonText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.colors.text.light,
    },
    doubleButtonTextDisabled: {
      color: '#9E9E9E',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    teamSelectorContainer: {
      backgroundColor: theme.colors.background.card,
      borderRadius: 8,
      padding: 16,
    },
    teamSelectorItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    teamSelectorItemActive: {
      backgroundColor: theme.colors.background.surface,
    },
    teamSelectorText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
    },
  });

  const handleScoreChange = (team, change) => {
    if (onScoreChange) {
      onScoreChange(team, change);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.card }]}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.teamsScroll}
        contentContainerStyle={styles.teamsContainer}
      >
        {validTeams.map((team, index) => (
          <TouchableOpacity 
            key={team}
            onPress={() => onTeamChange?.(index)}
            style={[
              styles.teamCard,
              currentTeamIndex === index && styles.activeTeamCard,
              { 
                backgroundColor: currentTeamIndex === index ? 
                  theme.colors.primary + '15' : // 15 is opacity
                  theme.colors.background.surface,
                borderColor: currentTeamIndex === index ?
                  theme.colors.primary :
                  theme.colors.border
              }
            ]}
          >
            <View style={styles.teamMainContent}>
              <Text style={[
                styles.teamName,
                { 
                  color: currentTeamIndex === index ? 
                    theme.colors.primary : 
                    theme.colors.text.primary,
                  fontSize: isSmallScreen ? FONTS.sizes.body : FONTS.sizes.h3
                }
              ]}>
                {team}
              </Text>
              
              <View style={styles.scoreRow}>
                <TouchableOpacity 
                  style={[
                    styles.scoreButton,
                    {
                      backgroundColor: theme.colors.error + '15',
                      borderColor: theme.colors.error
                    }
                  ]}
                  onPress={() => handleScoreChange(team, (validScores[team] || 0) - 50)}
                >
                  <Text style={[
                    styles.scoreButtonText,
                    { color: theme.colors.error }
                  ]}>-</Text>
                </TouchableOpacity>
                
                <Text style={[
                  styles.scoreText,
                  { color: getScoreColor(validScores[team] || 0) }
                ]}>
                  {validScores[team] || 0}
                </Text>
                
                <TouchableOpacity 
                  style={[
                    styles.scoreButton,
                    {
                      backgroundColor: theme.colors.success + '15',
                      borderColor: theme.colors.success
                    }
                  ]}
                  onPress={() => handleScoreChange(team, (validScores[team] || 0) + 50)}
                >
                  <Text style={[
                    styles.scoreButtonText,
                    { color: theme.colors.success }
                  ]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {currentTeamIndex === index && (
              <TouchableOpacity
                style={[
                  styles.doubleButton,
                  isDoublePoints && styles.doubleButtonActive,
                  validDoublePoints[team] && styles.doubleButtonDisabled,
                  {
                    backgroundColor: isDoublePoints ? 
                      theme.colors.warning + '30' :
                      theme.colors.background.surface,
                    borderColor: theme.colors.warning
                  }
                ]}
                onPress={() => {
                  if (!validDoublePoints[team]) {
                    onDoublePointsChange(!isDoublePoints);
                  }
                }}
                disabled={validDoublePoints[team]}
              >
                <Text style={[
                  styles.doubleButtonText,
                  validDoublePoints[team] && styles.doubleButtonTextDisabled,
                  { color: theme.colors.warning }
                ]}>
                  X2
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.endRoundButton}
        onPress={handleEndRound}
      >
        <Text style={styles.endRoundButtonText}>إنهاء الجولة</Text>
      </TouchableOpacity>

      <Modal
        visible={showTeamSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTeamSelector(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTeamSelector(false)}
        >
          <View style={[styles.teamSelectorContainer, { backgroundColor: theme.colors.background.card }]}>
            {validTeams.map((team, index) => (
              <TouchableOpacity
                key={team}
                style={[
                  styles.teamSelectorItem,
                  currentTeamIndex === index && styles.teamSelectorItemActive,
                  { borderBottomColor: theme.colors.border }
                ]}
                onPress={() => handleTeamSelect(index)}
              >
                <Text style={[
                  styles.teamSelectorText,
                  { color: currentTeamIndex === index ? theme.colors.primary : theme.colors.text.primary }
                ]}>
                  {team}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}; 