import React,{useState} from 'react';
import DatePicker from 'react-datepicker'
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'




 function DatePickerandTime( { startDate , HandlePickUpdate ,excludeTimes =[] , minTime } ){
       
    // const [startDate, setStartDate] = useState(
    //     setHours(setMinutes(new Date(), 30), 16)
    //   );

            return(
            <>

            <DatePicker
            selected={startDate}
            onChange={(date) => HandlePickUpdate(date)}
            showTimeSelect
            minDate={new Date()}
            minTime={minTime}
            maxTime={moment().endOf('day').toDate()} // set to 23:59 pm today
            timeIntervals={60}
            
        //     excludeTimes={excludeTimes}
            // excludeDates={[moment(), moment().subtract(1, "days")]}
            minDate={moment().toDate()}
             dateFormat="MMMM d, yyyy h:mm aa"
            />

            </>


            )
}

export default DatePickerandTime;