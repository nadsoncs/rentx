import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { useNavigation, CommonActions, useRoute } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';

import { CarDTO } from '../../dtos/CarDTO';
import { BackButton } from '../../components/BackButton';

import ArrowSvg from '../../assets/arrow.svg';
import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  Content,
  Footer,
} from './styles';
import { StatusBar } from 'react-native';

import { Button } from '../../components/Button';
import {
  Calendar,
  DayProps,
  generateInterval,
  MarkedDateProps
} from '../../components/Calendar';

interface Params {
  car: CarDTO
}
interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}
export function Scheduling(){
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

  
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params as Params;
  
  function handleConfirmRental(){
    navigation.dispatch(
      CommonActions.navigate({
        name: 'SchedulingDetails',
        params: {
          car,
          dates: Object.keys(markedDates)
        }
      })
    );
  }

  function handleBack(){
    navigation.goBack()
  }

  function handleChangeDate(date: DayProps){
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if(start.timestamp > end.timestamp){
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    

    setRentalPeriod({
      startFormatted: format(parseISO(start.dateString), 'dd/MM/yyyy') ,
      endFormatted: format(parseISO(end.dateString), 'dd/MM/yyyy')
    })
  }

  return (
    <Container>
      <Header>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <BackButton 
          color={theme.colors.shape}
          onPress={handleBack} 
        />

        <Title>
          Escolha uma {'\n'}
          data de in??cio e {'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue selected={!!rentalPeriod.startFormatted} >
              { rentalPeriod.startFormatted }
            </DateValue>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>AT??</DateTitle>
            <DateValue selected={!!rentalPeriod.endFormatted} >
              { rentalPeriod.endFormatted }
            </DateValue>
          </DateInfo>
        </RentalPeriod>
      </Header>

      <Content>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleChangeDate}
        />
      </Content>

      <Footer>
        <Button 
          title="Confirmar" 
          onPress={handleConfirmRental}
          enabled={!!rentalPeriod.startFormatted}
        />
      </Footer>
    </Container>
  );
}