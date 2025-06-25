import Colors from '@/constants/Colors';
import { Car } from '@/types';
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface CarSelectorProps {
  cars: Car[];
  selectedCar: Car | null;
  onSelectCar: (car: Car) => void;
}

const CarSelector: React.FC<CarSelectorProps> = ({
  cars,
  selectedCar,
  onSelectCar,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  
  const handleSelectCar = (car: Car) => {
    onSelectCar(car);
    toggleModal();
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.selector} 
        onPress={toggleModal}
        activeOpacity={0.7}
      >
        <Text style={styles.selectorText}>
          {selectedCar ? `${selectedCar.name} ${selectedCar.model}` : 'Select a car'}
        </Text>
        <ChevronDown size={20} color={Colors.text} />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Car</Text>
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.carList}>
              {cars.map((car) => (
                <TouchableOpacity
                  key={car.id}
                  style={[
                    styles.carItem,
                    selectedCar?.id === car.id && styles.selectedCarItem,
                  ]}
                  onPress={() => handleSelectCar(car)}
                >
                  <Text style={[
                    styles.carName,
                    selectedCar?.id === car.id && styles.selectedCarText,
                  ]}>
                    {car.name} {car.model}
                  </Text>
                  <Text style={styles.carPlate}>{car.plateNumber}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  selectorText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    fontSize: 16,
    color: Colors.primary,
  },
  carList: {
    padding: 16,
  },
  carItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.card,
  },
  selectedCarItem: {
    backgroundColor: Colors.primary,
  },
  carName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  selectedCarText: {
    color: '#fff',
  },
  carPlate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default CarSelector;