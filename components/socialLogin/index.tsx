// 21522436 - Nguyễn Thị Hồng Nhung
import { Image, View } from 'react-native';

import { Button } from '../ui/button';
import { Text } from '../ui/text';

export default function SocialLogin() {
  const handleLoginGoogle = () => {
    console.log('Login with Google');
  };

  const handleLoginFacebook = () => {
    console.log('Login with Facebook');
  };

  return (
    <View className="flex flex-row items-center justify-center gap-3">
      <Button variant="outline" className="w-40 " onPress={handleLoginGoogle}>
        <View className="flex flex-row gap-3">
          <Image
            source={require('~/assets/images/google.png')}
            className="aspect-square size-8 overflow-hidden rounded-full"
          />
          <Text className="text-sm">Google</Text>
        </View>
      </Button>
      <Button variant="outline" className="w-40 " onPress={handleLoginFacebook}>
        <View className="flex flex-row gap-3">
          <Image
            source={require('~/assets/images/facebook.jpg')}
            className="aspect-square size-8 overflow-hidden rounded-full"
          />
          <Text className="text-sm">Facebook</Text>
        </View>
      </Button>
    </View>
  );
}
