import {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Button,
  Fieldset,
  Form,
  Input, Spinner, styled, useTheme,
} from 'tamagui'

const Account = () => {
  const theme = useTheme();
  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off')
  useEffect(() => {
    if (status === 'submitting') {
      const timer = setTimeout(() => setStatus('off'), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  const CustomInput = styled(Input, {
    backgroundColor: theme.input,
  })

  return (
    <View style={styles.container}>
      <Form
        style={styles.form}
        // alignItems="center"
        // minWidth={300}
        gap="$2"
        onSubmit={() => setStatus('submitting')}
        // borderWidth={1}
        borderRadius="$4"
        backgroundColor="#FFFFFF"
        // borderColor="$borderColor"
        padding="$2"
      >
        <Fieldset gap="$4" horizontal>
          <CustomInput flex={1} id="username" placeholder="Nate Wienert" />
        </Fieldset>
        <Fieldset gap="$4" horizontal>
          <CustomInput flex={1} id="password" defaultValue="Nate Wienert" />
        </Fieldset>
        <CustomInput
          size="$4" value={"aaa"} />
        <Form.Trigger asChild disabled={status !== 'off'}>
          <Button
            color="#fff"
            backgroundColor={theme.primary}
            style={styles.button} icon={status === 'submitting' ? () => <Spinner /> : undefined}>
            Submit
          </Button>
        </Form.Trigger>
      </Form>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 15,
    backgroundColor: '#f3f3f3',
  },
  form: {
    shadowOffset:{  width: 0,  height: 3,  },
    shadowColor: '#939393',
    shadowRadius: 3,
    shadowOpacity: 0.3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    marginBottom: 12,
  },
  button: {
    // width: '100%',
    // justifyContent: 'center'
  },
});

export default Account;
