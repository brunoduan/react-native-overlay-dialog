import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import {
  DialogBottom,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogAction,
} from 'react-native-overlay-dialog';

export default function App() {
  const [firstVisible, setFirstVisible] = useState(false);
  const [secondVisible, setSecondVisible] = useState(false);

  return (
    <View style={[styles.root]}>
      <TouchableHighlight
        onPress={() => setFirstVisible(true)}
        style={[styles.button]}
        underlayColor="#F7F7F7"
      >
        <Text style={[styles.text]}>Open the first dialog</Text>
      </TouchableHighlight>

      <DialogBottom
        width={1}
        height={0.6}
        visible={firstVisible}
        onTapOut={() => {
          setFirstVisible(false);
        }}
        onSwipeOut={() => {
          setFirstVisible(false);
        }}
        title={
          <DialogTitle title="The first dialog" />
        }
        body={
          <DialogBody style={[styles.body]}>
          <Text style={[{paddingBottom: 60}]}>The first dialog body</Text>

          <TouchableHighlight
            onPress={() => setSecondVisible(true)}
            style={[styles.button]}
            underlayColor="#F7F7F7"
          >
            <Text style={[styles.text]}>Open the second dialog</Text>
          </TouchableHighlight>
        </DialogBody>
        }
        footer={
          <DialogFooter>
            <DialogAction
              text="取消"
              onPress={() => {
                setFirstVisible(false);
              }}
            />
            <DialogAction
              text="确定"
              onPress={() => {
                setFirstVisible(false);
              }}
            />
          </DialogFooter>
        }
      />

      <DialogBottom
        width={1}
        height={0.6}
        hasOverlay={false}
        visible={secondVisible}
        onTapOut={() => {
          setSecondVisible(false);
        }}
        onSwipeOut={() => {
          setSecondVisible(false);
        }}
        title={
          <DialogTitle title="The second dialog" />
        }
        body={
          <DialogBody style={[styles.body]}>
            <Text>The second dialog body</Text>
          </DialogBody>
        }
        footer={
          <DialogFooter>
            <DialogAction
              text="取消"
              onPress={() => {
                setSecondVisible(false);
              }}
            />
            <DialogAction
              text="确定"
              onPress={() => {
                setSecondVisible(false);
              }}
            />
          </DialogFooter>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 35
  },
  button: {
    width: 325,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#939AA9',
    borderColor: 'rgba(151,151,151,0.2)',
    borderRadius: 10
  },
  text: {
    fontWeight: '500',
    fontSize: 18,
    color: '#0F1520'
  },
  body: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 20
  }
});
