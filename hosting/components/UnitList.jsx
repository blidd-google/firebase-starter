import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Grid, Stack } from '@mui/material';
import * as dayjs from 'dayjs';
import * as React from 'react';
import { useState } from 'react';
import isToday from 'dayjs/plugin/isToday';
import { useContext } from 'react';
import { UnitDetailContext, UnitsContext } from '../context';
import { applyFiltersToUnits } from '../lib/filters';
import UnitCard from './UnitCard';
dayjs.extend(isToday);

const UnitList = ({ filters, onClick }) => {
  const [displayAddForm, setDisplayAddForm] = useState(false);
  const [displayAlert, setDisplayAlert] = useState({
    display: false,
    severity: '',
    message: '',
  });
  const { units } = useContext(UnitsContext);
  const openUnit = useContext(UnitDetailContext);

  const unitsFiltered = applyFiltersToUnits(units, filters);

  // if no filter fn is specified, will return all units
  // const unitsFilt = Object.values(units).filter(filterFn || (() => true));
  onClick = openUnit || onClick;

  return (
    <>
      <Grid container spacing={2} sx={{ maxHeight: 500, overflow: 'auto' }}>
        {unitsFiltered.map(({ id, ...props }) => (
          <Grid item xs={12} key={id}>
            <UnitCard
              unitProps={props}
              onClick={() => onClick(id) || (() => {})}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          {!displayAddForm && (
            <Button
              variant="outlined"
              endIcon={<AddIcon />}
              onClick={() => setDisplayAddForm(true)}
            >
              Quick Add
            </Button>
          )}
        </Grid>
        <Grid item xs={12}>
          <Stack>
            {displayAlert.display && (
              <Alert
                severity={displayAlert.severity}
                onClose={() => {
                  setDisplayAlert({
                    display: false,
                    severity: '',
                    message: '',
                  });
                }}
              >
                {displayAlert.message}
              </Alert>
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default UnitList;
