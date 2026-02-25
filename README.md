# News Mobile App (React Native CLI, No Expo)

React Native bare app (no Expo) that consumes the GNews API.

## 1. Clone The Project

```bash
git clone https://github.com/moewb1/NewsMobileApp.git
cd NewsMobileApp
```

## 2. Install Node.js (Mac, one-time)

If Node is already installed, skip this section.

```bash
brew install nvm
mkdir -p ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
nvm install --lts
nvm use --lts
node -v
npm -v
```

## 3. Install Project Dependencies (node_modules)

```bash
npm install
```

## 4. Install CocoaPods (Mac, one-time)

If CocoaPods is already installed, skip this section.

```bash
brew install cocoapods
pod --version
```

Then install iOS pods for this project:

```bash
cd ios
pod install
cd ..
```

## 5. Configure Environment File (Exact Format)

### 5.1 Generate `.env` locally

From the project root, run:

```bash
cp .env.example .env
```

### 5.2 Get the API key

Do not hardcode the API key in the repository.

Request access from the project owner:
- Contact: `<+961 71624288>`
- Email: `<moetassem.wehbe.01@gmail.com>`
- Subject: `NewsMobileApp - GNews API Key Request`

Message template:
```text
Hi, I need the GNews API key for NewsMobileApp.
Please share the current key for local development.
```

### 5.3 Place the API key in `.env` (exactly here)

Open `.env` and set:

```env
GNEWS_BASE_URL=https://gnews.io/api/v4
GNEWS_API_KEY=PASTE_THE_KEY_HERE
```

Example with a real key format:

```env
GNEWS_BASE_URL=https://gnews.io/api/v4
GNEWS_API_KEY=aa999aa99aa999a999a
```

Rules:
- Do not add quotes.
- Do not add spaces around `=`.
- Keep `.env` private (never commit it).

## 6. Android Env Integration Check

In `android/app/build.gradle`, ensure this line exists:

```gradle
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

## 7. Run The App

Start Metro in Terminal 1:

```bash
npm start
```

Run iOS in Terminal 2:

```bash
npm run ios
```

Run Android in Terminal 2:

```bash
npm run android
```

## 8. Common Fixes

If iOS build fails after dependency changes:

```bash
cd ios
pod install --repo-update
cd ..
```

If Metro cache issues appear:

```bash
npx react-native start --reset-cache
```

## 9. Project Structure

```text
src
|-- api
|-- components
|   |-- common
|   `-- news
|-- config
|-- hooks
|-- screens
|-- theme
|-- types
`-- utils
```

## 10. Security Note

- `.env` is ignored by git and must stay local.
- Mobile apps are client-side, so API keys are never fully secret in production apps.
- For real production security, move API calls to your backend and keep keys on server only.