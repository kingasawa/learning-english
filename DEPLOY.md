# DEPLOYMENT
How to update a new version to testflight

## Get started

1. Update version or buildNumber on app.json

2. Run build command

   ```bash
    eas build --profile production --platform ios --clear-cache
   ```

3. Go to [Expo Dev Build](https://expo.dev/accounts/kingasawa/projects/bot-talk/builds) and download .IPA
4. Submit to Testflight
- Open [Transporter App](https://apps.apple.com/us/app/transporter/id1450874784?mt=12) to upload .IPA file
- Or use command 
```bash
eas submit --platform ios
```
5. Go to [Appstore Connect](https://appstoreconnect.apple.com/) to Release
