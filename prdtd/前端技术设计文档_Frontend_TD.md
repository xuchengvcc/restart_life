# 《重启人生》前端技术设计文档 (Frontend TDD)

## 文档信息
- **版本**: v1.0
- **创建日期**: 2025-01-26
- **最后更新**: 2025-01-26
- **作者**: 前端技术团队

## 1. 前端架构概览

### 1.1 技术栈选择
- **游戏引擎**: Unity 2022.3 LTS
- **编程语言**: C#
- **UI框架**: Unity UI Toolkit (UI Builder)
- **网络通信**: Unity HTTP客户端 + Newtonsoft.Json
- **本地存储**: Unity PlayerPrefs + JSON文件
- **状态管理**: 自定义状态管理系统

### 1.2 架构设计原则
- **模块化设计**: 各功能模块独立，松耦合
- **数据驱动**: 通过配置文件驱动UI和游戏逻辑
- **MVC模式**: 分离数据、视图和控制逻辑
- **单一职责**: 每个类只负责一个明确的功能

### 1.3 项目结构
```
Assets/
├── Scripts/
│   ├── Core/                    # 核心系统
│   │   ├── GameManager.cs       # 游戏管理器
│   │   ├── StateManager.cs      # 状态管理器
│   │   ├── EventSystem.cs       # 事件系统
│   │   └── DataManager.cs       # 数据管理器
│   ├── Models/                  # 数据模型
│   │   ├── Character.cs         # 角色数据模型
│   │   ├── GameEvent.cs         # 事件数据模型
│   │   └── Achievement.cs       # 成就数据模型
│   ├── Views/                   # UI视图层
│   │   ├── MainMenu/            # 主菜单界面
│   │   ├── CharacterCreation/   # 角色创建界面
│   │   ├── GamePlay/            # 主游戏界面
│   │   └── CharacterStatus/     # 状态查看界面
│   ├── Controllers/             # 控制器层
│   │   ├── MenuController.cs    # 菜单控制器
│   │   ├── GameController.cs    # 游戏控制器
│   │   └── UIController.cs      # UI控制器
│   ├── Services/                # 服务层
│   │   ├── APIService.cs        # API服务
│   │   ├── SaveService.cs       # 存档服务
│   │   └── ConfigService.cs     # 配置服务
│   └── Utils/                   # 工具类
│       ├── JsonHelper.cs        # JSON工具
│       ├── UIAnimations.cs      # UI动画工具
│       └── LocalizationHelper.cs # 本地化工具
├── UI/                          # UI资源
│   ├── Prefabs/                 # UI预制体
│   ├── Styles/                  # UI样式表
│   └── Icons/                   # 图标资源
├── Data/                        # 数据文件
│   ├── Characters/              # 角色配置
│   ├── Events/                  # 事件配置
│   └── Localization/            # 本地化文件
└── StreamingAssets/             # 流式资源
    └── Configs/                 # 配置文件
```

## 2. 核心系统设计

### 2.1 游戏管理器 (GameManager)

```csharp
using UnityEngine;
using System;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    
    [Header("Game Settings")]
    public bool IsDebugMode = false;
    public string ServerURL = "http://localhost:8080/api/v1";
    
    // 游戏状态
    public enum GameState
    {
        MainMenu,
        CharacterCreation,
        GamePlay,
        CharacterStatus,
        Settings
    }
    
    public GameState CurrentState { get; private set; }
    public event Action<GameState> OnStateChanged;
    
    // 核心组件引用
    public StateManager StateManager { get; private set; }
    public DataManager DataManager { get; private set; }
    public UIController UIController { get; private set; }
    public APIService APIService { get; private set; }
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            InitializeGame();
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    private void InitializeGame()
    {
        // 初始化各个管理器
        StateManager = GetComponent<StateManager>();
        DataManager = GetComponent<DataManager>();
        UIController = GetComponent<UIController>();
        APIService = GetComponent<APIService>();
        
        // 订阅事件
        StateManager.OnStateChanged += OnGameStateChanged;
        
        // 初始化配置
        ConfigService.Instance.LoadConfigs();
        
        // 设置初始状态
        ChangeState(GameState.MainMenu);
    }
    
    public void ChangeState(GameState newState)
    {
        CurrentState = newState;
        StateManager.ChangeState(newState);
        OnStateChanged?.Invoke(newState);
    }
    
    private void OnGameStateChanged(GameState state)
    {
        UIController.ShowUI(state);
    }
    
    public void QuitGame()
    {
        SaveService.Instance.SaveAllData();
        Application.Quit();
    }
}
```

### 2.2 数据管理器 (DataManager)

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class GameData
{
    public CharacterData currentCharacter;
    public List<CharacterData> allCharacters = new List<CharacterData>();
    public Dictionary<string, bool> achievements = new Dictionary<string, bool>();
    public GameSettings settings = new GameSettings();
    public DateTime lastSaveTime;
}

public class DataManager : MonoBehaviour
{
    public static DataManager Instance { get; private set; }
    
    [Header("Data Settings")]
    public string SaveFileName = "gamedata.json";
    
    public GameData CurrentGameData { get; private set; }
    public CharacterData CurrentCharacter => CurrentGameData?.currentCharacter;
    
    // 数据变化事件
    public event Action<CharacterData> OnCharacterChanged;
    public event Action<List<CharacterData>> OnCharacterListChanged;
    public event Action<Dictionary<string, bool>> OnAchievementsChanged;
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            InitializeData();
        }
    }
    
    private void InitializeData()
    {
        LoadGameData();
        if (CurrentGameData == null)
        {
            CurrentGameData = new GameData();
            SaveGameData();
        }
    }
    
    public void LoadGameData()
    {
        CurrentGameData = SaveService.Instance.LoadGameData();
    }
    
    public void SaveGameData()
    {
        CurrentGameData.lastSaveTime = DateTime.Now;
        SaveService.Instance.SaveGameData(CurrentGameData);
    }
    
    public void SetCurrentCharacter(CharacterData character)
    {
        CurrentGameData.currentCharacter = character;
        OnCharacterChanged?.Invoke(character);
        SaveGameData();
    }
    
    public void AddCharacter(CharacterData character)
    {
        CurrentGameData.allCharacters.Add(character);
        OnCharacterListChanged?.Invoke(CurrentGameData.allCharacters);
        SaveGameData();
    }
    
    public void UnlockAchievement(string achievementId)
    {
        if (!CurrentGameData.achievements.ContainsKey(achievementId))
        {
            CurrentGameData.achievements[achievementId] = true;
            OnAchievementsChanged?.Invoke(CurrentGameData.achievements);
            SaveGameData();
        }
    }
}
```

### 2.3 UI控制器 (UIController)

```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;

public class UIController : MonoBehaviour
{
    [Header("UI Documents")]
    public UIDocument MainMenuDocument;
    public UIDocument CharacterCreationDocument;
    public UIDocument GamePlayDocument;
    public UIDocument CharacterStatusDocument;
    
    private Dictionary<GameManager.GameState, UIDocument> uiDocuments;
    private Dictionary<GameManager.GameState, IUIView> uiViews;
    
    private void Start()
    {
        InitializeUI();
    }
    
    private void InitializeUI()
    {
        // 初始化UI文档映射
        uiDocuments = new Dictionary<GameManager.GameState, UIDocument>
        {
            { GameManager.GameState.MainMenu, MainMenuDocument },
            { GameManager.GameState.CharacterCreation, CharacterCreationDocument },
            { GameManager.GameState.GamePlay, GamePlayDocument },
            { GameManager.GameState.CharacterStatus, CharacterStatusDocument }
        };
        
        // 初始化UI视图
        uiViews = new Dictionary<GameManager.GameState, IUIView>
        {
            { GameManager.GameState.MainMenu, new MainMenuView(MainMenuDocument) },
            { GameManager.GameState.CharacterCreation, new CharacterCreationView(CharacterCreationDocument) },
            { GameManager.GameState.GamePlay, new GamePlayView(GamePlayDocument) },
            { GameManager.GameState.CharacterStatus, new CharacterStatusView(CharacterStatusDocument) }
        };
        
        // 初始时隐藏所有UI
        foreach (var doc in uiDocuments.Values)
        {
            if (doc != null)
                doc.gameObject.SetActive(false);
        }
    }
    
    public void ShowUI(GameManager.GameState state)
    {
        // 隐藏所有UI
        foreach (var doc in uiDocuments.Values)
        {
            if (doc != null)
                doc.gameObject.SetActive(false);
        }
        
        // 显示目标UI
        if (uiDocuments.ContainsKey(state) && uiDocuments[state] != null)
        {
            uiDocuments[state].gameObject.SetActive(true);
            uiViews[state]?.OnShow();
        }
    }
    
    public T GetView<T>(GameManager.GameState state) where T : class, IUIView
    {
        if (uiViews.ContainsKey(state))
            return uiViews[state] as T;
        return null;
    }
}
```

## 3. UI系统设计

### 3.1 UI视图接口

```csharp
public interface IUIView
{
    void OnShow();
    void OnHide();
    void UpdateView();
}

public abstract class BaseUIView : IUIView
{
    protected UIDocument document;
    protected VisualElement root;
    
    public BaseUIView(UIDocument uiDocument)
    {
        document = uiDocument;
        root = document.rootVisualElement;
        InitializeView();
    }
    
    protected abstract void InitializeView();
    
    public virtual void OnShow()
    {
        UpdateView();
    }
    
    public virtual void OnHide()
    {
        // 清理视图资源
    }
    
    public abstract void UpdateView();
}
```

### 3.2 主菜单视图

```csharp
public class MainMenuView : BaseUIView
{
    private Button newGameButton;
    private Button continueGameButton;
    private Button achievementsButton;
    private Button settingsButton;
    private Button quitButton;
    
    public MainMenuView(UIDocument uiDocument) : base(uiDocument) { }
    
    protected override void InitializeView()
    {
        // 获取UI元素
        newGameButton = root.Q<Button>("new-game-button");
        continueGameButton = root.Q<Button>("continue-game-button");
        achievementsButton = root.Q<Button>("achievements-button");
        settingsButton = root.Q<Button>("settings-button");
        quitButton = root.Q<Button>("quit-button");
        
        // 绑定事件
        newGameButton.clicked += OnNewGameClicked;
        continueGameButton.clicked += OnContinueGameClicked;
        achievementsButton.clicked += OnAchievementsClicked;
        settingsButton.clicked += OnSettingsClicked;
        quitButton.clicked += OnQuitClicked;
    }
    
    public override void UpdateView()
    {
        // 根据游戏数据更新按钮状态
        bool hasExistingCharacter = DataManager.Instance.CurrentGameData.allCharacters.Count > 0;
        continueGameButton.SetEnabled(hasExistingCharacter);
    }
    
    private void OnNewGameClicked()
    {
        GameManager.Instance.ChangeState(GameManager.GameState.CharacterCreation);
    }
    
    private void OnContinueGameClicked()
    {
        if (DataManager.Instance.CurrentCharacter != null)
        {
            GameManager.Instance.ChangeState(GameManager.GameState.GamePlay);
        }
        else
        {
            // 显示角色选择界面
            ShowCharacterSelectionDialog();
        }
    }
    
    private void OnAchievementsClicked()
    {
        // 显示成就界面
        ShowAchievementsDialog();
    }
    
    private void OnSettingsClicked()
    {
        GameManager.Instance.ChangeState(GameManager.GameState.Settings);
    }
    
    private void OnQuitClicked()
    {
        GameManager.Instance.QuitGame();
    }
    
    private void ShowCharacterSelectionDialog()
    {
        // 实现角色选择对话框
    }
    
    private void ShowAchievementsDialog()
    {
        // 实现成就展示对话框
    }
}
```

### 3.3 角色创建视图

```csharp
public class CharacterCreationView : BaseUIView
{
    private DropdownField countryDropdown;
    private SliderInt birthYearSlider;
    private Label characterInfoLabel;
    private Button randomizeButton;
    private Button confirmButton;
    private Button backButton;
    
    private CharacterCreationData creationData;
    
    public CharacterCreationView(UIDocument uiDocument) : base(uiDocument) { }
    
    protected override void InitializeView()
    {
        // 获取UI元素
        countryDropdown = root.Q<DropdownField>("country-dropdown");
        birthYearSlider = root.Q<SliderInt>("birth-year-slider");
        characterInfoLabel = root.Q<Label>("character-info-label");
        randomizeButton = root.Q<Button>("randomize-button");
        confirmButton = root.Q<Button>("confirm-button");
        backButton = root.Q<Button>("back-button");
        
        // 设置控件属性
        birthYearSlider.lowValue = 1800;
        birthYearSlider.highValue = 2050;
        birthYearSlider.value = 1990;
        
        // 初始化国家选项
        countryDropdown.choices = ConfigService.Instance.GetCountryList();
        countryDropdown.value = "中国";
        
        // 绑定事件
        countryDropdown.RegisterValueChangedCallback(OnCountryChanged);
        birthYearSlider.RegisterValueChangedCallback(OnBirthYearChanged);
        randomizeButton.clicked += OnRandomizeClicked;
        confirmButton.clicked += OnConfirmClicked;
        backButton.clicked += OnBackClicked;
        
        // 生成初始角色
        GenerateRandomCharacter();
    }
    
    public override void UpdateView()
    {
        if (creationData != null)
        {
            UpdateCharacterInfo();
        }
    }
    
    private void OnCountryChanged(ChangeEvent<string> evt)
    {
        GenerateRandomCharacter();
    }
    
    private void OnBirthYearChanged(ChangeEvent<int> evt)
    {
        GenerateRandomCharacter();
    }
    
    private void OnRandomizeClicked()
    {
        GenerateRandomCharacter();
    }
    
    private void OnConfirmClicked()
    {
        if (creationData != null)
        {
            CreateCharacter();
        }
    }
    
    private void OnBackClicked()
    {
        GameManager.Instance.ChangeState(GameManager.GameState.MainMenu);
    }
    
    private void GenerateRandomCharacter()
    {
        creationData = CharacterGenerator.GenerateRandomCharacter(
            countryDropdown.value,
            birthYearSlider.value
        );
        UpdateCharacterInfo();
    }
    
    private void UpdateCharacterInfo()
    {
        string info = FormatCharacterInfo(creationData);
        characterInfoLabel.text = info;
    }
    
    private string FormatCharacterInfo(CharacterCreationData data)
    {
        return $"姓名: {data.name}\n" +
               $"性别: {data.gender}\n" +
               $"人种: {data.race}\n" +
               $"出生国家: {data.birthCountry}\n" +
               $"出生年份: {data.birthYear}\n\n" +
               $"基础属性:\n" +
               $"智力: {data.attributes.intelligence}\n" +
               $"体质: {data.attributes.constitution}\n" +
               $"魅力: {data.attributes.charisma}\n" +
               $"意志力: {data.attributes.willpower}\n" +
               $"创造力: {data.attributes.creativity}\n\n" +
               $"家庭背景:\n" +
               $"{data.familyBackground}";
    }
    
    private void CreateCharacter()
    {
        var character = CharacterFactory.CreateCharacter(creationData);
        DataManager.Instance.AddCharacter(character);
        DataManager.Instance.SetCurrentCharacter(character);
        GameManager.Instance.ChangeState(GameManager.GameState.GamePlay);
    }
}
```

## 4. 数据模型设计

### 4.1 角色数据模型

```csharp
[System.Serializable]
public class CharacterData
{
    public string characterId;
    public string characterName;
    public string birthCountry;
    public int birthYear;
    public int currentAge;
    public string gender;
    public string race;
    public bool isActive;
    public System.DateTime createdAt;
    public System.DateTime updatedAt;
    
    public CharacterAttributes attributes;
    public CharacterHealth health;
    public CharacterEconomics economics;
    public List<CharacterRelationship> relationships;
    public List<string> achievements;
    public List<GameEventData> eventHistory;
}

[System.Serializable]
public class CharacterAttributes
{
    public int intelligence = 50;
    public int constitution = 50;
    public int charisma = 50;
    public int willpower = 50;
    public int creativity = 50;
    public int academicSkill = 0;
    public int socialSkill = 0;
    public int athleticSkill = 0;
    public int artisticSkill = 0;
    public int businessSkill = 0;
}

[System.Serializable]
public class CharacterHealth
{
    public int physicalHealth = 100;
    public int mentalHealth = 100;
    public int stressLevel = 0;
    public int fitnessLevel = 50;
    public List<string> conditions = new List<string>();
}

[System.Serializable]
public class CharacterEconomics
{
    public decimal cashAmount = 0;
    public decimal annualIncome = 0;
    public decimal totalAssets = 0;
    public decimal totalDebts = 0;
    public string occupation = "";
    public int occupationLevel = 1;
}

[System.Serializable]
public class CharacterRelationship
{
    public string npcName;
    public string relationshipType;
    public int intimacyLevel;
    public int trustLevel;
    public int supportLevel;
    public int startAge;
    public int? endAge;
    public bool isActive = true;
}
```

### 4.2 事件数据模型

```csharp
[System.Serializable]
public class GameEventData
{
    public string eventId;
    public string templateId;
    public int eventAge;
    public string eventTitle;
    public string eventDescription;
    public string eventType; // random, choice, development, relationship, era
    public List<EventChoice> choices;
    public string chosenOptionId;
    public EventResult result;
    public System.DateTime createdAt;
}

[System.Serializable]
public class EventChoice
{
    public string choiceId;
    public string choiceText;
    public Dictionary<string, object> requirements;
    public Dictionary<string, object> effects;
    public int choiceOrder;
}

[System.Serializable]
public class EventResult
{
    public string description;
    public Dictionary<string, int> attributeChanges;
    public Dictionary<string, decimal> economicChanges;
    public List<string> relationshipChanges;
    public List<string> newAchievements;
    public List<string> healthChanges;
}
```

## 5. 网络通信设计

### 5.1 API服务

```csharp
using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
using Newtonsoft.Json;

public class APIService : MonoBehaviour
{
    public static APIService Instance { get; private set; }
    
    [Header("API Settings")]
    public string BaseURL = "http://localhost:8080/api/v1";
    public int TimeoutSeconds = 30;
    
    private string authToken;
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    public void SetAuthToken(string token)
    {
        authToken = token;
    }
    
    public IEnumerator RegisterUser(string username, string email, string password, 
        System.Action<bool, string> callback)
    {
        var requestData = new
        {
            username = username,
            email = email,
            password = password
        };
        
        yield return StartCoroutine(PostRequest("/auth/register", requestData, callback));
    }
    
    public IEnumerator LoginUser(string username, string password, 
        System.Action<bool, string> callback)
    {
        var requestData = new
        {
            username = username,
            password = password
        };
        
        yield return StartCoroutine(PostRequest("/auth/login", requestData, callback));
    }
    
    public IEnumerator CreateCharacter(CharacterCreationData creationData, 
        System.Action<bool, CharacterData> callback)
    {
        var requestData = new
        {
            character_name = creationData.name,
            birth_country = creationData.birthCountry,
            birth_year = creationData.birthYear,
            gender = creationData.gender,
            race = creationData.race
        };
        
        yield return StartCoroutine(PostRequest<CharacterData>("/characters", requestData, callback));
    }
    
    public IEnumerator AdvanceCharacter(string characterId, string advanceMode, 
        System.Action<bool, AdvanceResponse> callback)
    {
        var requestData = new
        {
            advance_mode = advanceMode
        };
        
        string endpoint = $"/characters/{characterId}/advance";
        yield return StartCoroutine(PostRequest<AdvanceResponse>(endpoint, requestData, callback));
    }
    
    public IEnumerator GetCharacterDetails(string characterId, 
        System.Action<bool, CharacterData> callback)
    {
        string endpoint = $"/characters/{characterId}";
        yield return StartCoroutine(GetRequest<CharacterData>(endpoint, callback));
    }
    
    private IEnumerator PostRequest(string endpoint, object data, 
        System.Action<bool, string> callback)
    {
        string url = BaseURL + endpoint;
        string jsonData = JsonConvert.SerializeObject(data);
        
        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            byte[] jsonBytes = Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(jsonBytes);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            
            if (!string.IsNullOrEmpty(authToken))
            {
                request.SetRequestHeader("Authorization", $"Bearer {authToken}");
            }
            
            request.timeout = TimeoutSeconds;
            
            yield return request.SendWebRequest();
            
            bool success = request.result == UnityWebRequest.Result.Success;
            string response = success ? request.downloadHandler.text : request.error;
            
            callback?.Invoke(success, response);
        }
    }
    
    private IEnumerator PostRequest<T>(string endpoint, object data, 
        System.Action<bool, T> callback) where T : class
    {
        yield return StartCoroutine(PostRequest(endpoint, data, (success, response) =>
        {
            if (success)
            {
                try
                {
                    T result = JsonConvert.DeserializeObject<T>(response);
                    callback?.Invoke(true, result);
                }
                catch (Exception e)
                {
                    Debug.LogError($"JSON deserialization error: {e.Message}");
                    callback?.Invoke(false, null);
                }
            }
            else
            {
                callback?.Invoke(false, null);
            }
        }));
    }
    
    private IEnumerator GetRequest<T>(string endpoint, 
        System.Action<bool, T> callback) where T : class
    {
        string url = BaseURL + endpoint;
        
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            if (!string.IsNullOrEmpty(authToken))
            {
                request.SetRequestHeader("Authorization", $"Bearer {authToken}");
            }
            
            request.timeout = TimeoutSeconds;
            
            yield return request.SendWebRequest();
            
            bool success = request.result == UnityWebRequest.Result.Success;
            
            if (success)
            {
                try
                {
                    T result = JsonConvert.DeserializeObject<T>(request.downloadHandler.text);
                    callback?.Invoke(true, result);
                }
                catch (Exception e)
                {
                    Debug.LogError($"JSON deserialization error: {e.Message}");
                    callback?.Invoke(false, null);
                }
            }
            else
            {
                callback?.Invoke(false, null);
            }
        }
    }
}
```

## 6. 本地存储设计

### 6.1 存档服务

```csharp
using System;
using System.IO;
using UnityEngine;
using Newtonsoft.Json;

public class SaveService : MonoBehaviour
{
    public static SaveService Instance { get; private set; }
    
    [Header("Save Settings")]
    public string SaveFileName = "gamedata.json";
    public bool UseEncryption = true;
    public string EncryptionKey = "RestartLife2025";
    
    private string SaveFilePath => Path.Combine(Application.persistentDataPath, SaveFileName);
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    public void SaveGameData(GameData gameData)
    {
        try
        {
            string json = JsonConvert.SerializeObject(gameData, Formatting.Indented);
            
            if (UseEncryption)
            {
                json = EncryptionHelper.Encrypt(json, EncryptionKey);
            }
            
            File.WriteAllText(SaveFilePath, json);
            Debug.Log($"Game data saved to: {SaveFilePath}");
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to save game data: {e.Message}");
        }
    }
    
    public GameData LoadGameData()
    {
        try
        {
            if (!File.Exists(SaveFilePath))
            {
                Debug.Log("Save file not found, creating new game data");
                return null;
            }
            
            string json = File.ReadAllText(SaveFilePath);
            
            if (UseEncryption)
            {
                json = EncryptionHelper.Decrypt(json, EncryptionKey);
            }
            
            GameData gameData = JsonConvert.DeserializeObject<GameData>(json);
            Debug.Log("Game data loaded successfully");
            return gameData;
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to load game data: {e.Message}");
            return null;
        }
    }
    
    public void SaveCharacterData(CharacterData character)
    {
        try
        {
            string characterPath = Path.Combine(Application.persistentDataPath, 
                $"character_{character.characterId}.json");
            
            string json = JsonConvert.SerializeObject(character, Formatting.Indented);
            
            if (UseEncryption)
            {
                json = EncryptionHelper.Encrypt(json, EncryptionKey);
            }
            
            File.WriteAllText(characterPath, json);
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to save character data: {e.Message}");
        }
    }
    
    public void SaveAllData()
    {
        if (DataManager.Instance?.CurrentGameData != null)
        {
            SaveGameData(DataManager.Instance.CurrentGameData);
        }
    }
    
    public void DeleteSaveFile()
    {
        try
        {
            if (File.Exists(SaveFilePath))
            {
                File.Delete(SaveFilePath);
                Debug.Log("Save file deleted");
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to delete save file: {e.Message}");
        }
    }
    
    public bool HasSaveFile()
    {
        return File.Exists(SaveFilePath);
    }
}
```

## 7. 性能优化

### 7.1 内存管理

```csharp
using System.Collections.Generic;
using UnityEngine;

public class ObjectPool<T> where T : class, new()
{
    private Queue<T> pool = new Queue<T>();
    private System.Func<T> createFunc;
    private System.Action<T> resetAction;
    
    public ObjectPool(System.Func<T> createFunc = null, System.Action<T> resetAction = null)
    {
        this.createFunc = createFunc ?? (() => new T());
        this.resetAction = resetAction;
    }
    
    public T Get()
    {
        if (pool.Count > 0)
        {
            return pool.Dequeue();
        }
        
        return createFunc();
    }
    
    public void Return(T item)
    {
        resetAction?.Invoke(item);
        pool.Enqueue(item);
    }
    
    public void Clear()
    {
        pool.Clear();
    }
}

public class MemoryManager : MonoBehaviour
{
    public static MemoryManager Instance { get; private set; }
    
    [Header("Memory Settings")]
    public int MaxCachedEvents = 100;
    public int MaxCachedCharacters = 10;
    public float GCInterval = 30f;
    
    private ObjectPool<GameEventData> eventPool;
    private ObjectPool<CharacterData> characterPool;
    private float lastGCTime;
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            InitializePools();
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    private void InitializePools()
    {
        eventPool = new ObjectPool<GameEventData>();
        characterPool = new ObjectPool<CharacterData>();
    }
    
    private void Update()
    {
        if (Time.time - lastGCTime > GCInterval)
        {
            System.GC.Collect();
            lastGCTime = Time.time;
        }
    }
    
    public GameEventData GetEvent()
    {
        return eventPool.Get();
    }
    
    public void ReturnEvent(GameEventData eventData)
    {
        eventPool.Return(eventData);
    }
    
    public void ClearUnusedAssets()
    {
        Resources.UnloadUnusedAssets();
    }
}
```

### 7.2 UI性能优化

```csharp
using UnityEngine;
using UnityEngine.UIElements;
using System.Collections;
using System.Collections.Generic;

public class UIOptimizer : MonoBehaviour
{
    [Header("UI Optimization Settings")]
    public float UIUpdateInterval = 0.1f;
    public int MaxVisibleItems = 50;
    
    private Dictionary<VisualElement, Coroutine> animationCoroutines = new Dictionary<VisualElement, Coroutine>();
    
    public void OptimizeScrollView(ScrollView scrollView, List<VisualElement> items)
    {
        // 实现虚拟化滚动视图
        StartCoroutine(VirtualizeScrollView(scrollView, items));
    }
    
    private IEnumerator VirtualizeScrollView(ScrollView scrollView, List<VisualElement> items)
    {
        while (scrollView != null)
        {
            float scrollPosition = scrollView.scrollOffset.y;
            float viewHeight = scrollView.layout.height;
            
            for (int i = 0; i < items.Count; i++)
            {
                var item = items[i];
                float itemTop = i * item.layout.height;
                float itemBottom = itemTop + item.layout.height;
                
                bool shouldBeVisible = itemBottom >= scrollPosition && 
                                     itemTop <= scrollPosition + viewHeight;
                
                if (shouldBeVisible && item.style.display == DisplayStyle.None)
                {
                    item.style.display = DisplayStyle.Flex;
                }
                else if (!shouldBeVisible && item.style.display == DisplayStyle.Flex)
                {
                    item.style.display = DisplayStyle.None;
                }
            }
            
            yield return new WaitForSeconds(UIUpdateInterval);
        }
    }
    
    public void AnimateElement(VisualElement element, Vector3 targetPosition, float duration)
    {
        if (animationCoroutines.ContainsKey(element))
        {
            StopCoroutine(animationCoroutines[element]);
        }
        
        animationCoroutines[element] = StartCoroutine(AnimatePosition(element, targetPosition, duration));
    }
    
    private IEnumerator AnimatePosition(VisualElement element, Vector3 targetPosition, float duration)
    {
        Vector3 startPosition = element.transform.position;
        float elapsedTime = 0;
        
        while (elapsedTime < duration)
        {
            float t = elapsedTime / duration;
            Vector3 currentPosition = Vector3.Lerp(startPosition, targetPosition, t);
            element.transform.position = currentPosition;
            
            elapsedTime += Time.deltaTime;
            yield return null;
        }
        
        element.transform.position = targetPosition;
        animationCoroutines.Remove(element);
    }
}
```

## 8. 调试和测试

### 8.1 调试工具

```csharp
using UnityEngine;
using System.Collections.Generic;

public class DebugManager : MonoBehaviour
{
    public static DebugManager Instance { get; private set; }
    
    [Header("Debug Settings")]
    public bool EnableDebugUI = true;
    public bool EnableConsoleLogging = true;
    public bool EnablePerformanceLogging = true;
    
    private Dictionary<string, object> debugData = new Dictionary<string, object>();
    private List<string> debugLogs = new List<string>();
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    private void OnGUI()
    {
        if (!EnableDebugUI) return;
        
        GUILayout.BeginArea(new Rect(10, 10, 300, Screen.height - 20));
        GUILayout.BeginVertical("box");
        
        GUILayout.Label("Debug Information", EditorStyles.boldLabel);
        
        foreach (var kvp in debugData)
        {
            GUILayout.Label($"{kvp.Key}: {kvp.Value}");
        }
        
        GUILayout.Space(10);
        GUILayout.Label("Recent Logs:", EditorStyles.boldLabel);
        
        for (int i = Mathf.Max(0, debugLogs.Count - 10); i < debugLogs.Count; i++)
        {
            GUILayout.Label(debugLogs[i]);
        }
        
        GUILayout.EndVertical();
        GUILayout.EndArea();
    }
    
    public void SetDebugValue(string key, object value)
    {
        debugData[key] = value;
    }
    
    public void LogDebug(string message)
    {
        if (EnableConsoleLogging)
        {
            Debug.Log($"[DEBUG] {message}");
        }
        
        debugLogs.Add($"{System.DateTime.Now:HH:mm:ss} - {message}");
        
        if (debugLogs.Count > 100)
        {
            debugLogs.RemoveAt(0);
        }
    }
    
    public void LogPerformance(string operation, float duration)
    {
        if (EnablePerformanceLogging)
        {
            LogDebug($"Performance: {operation} took {duration:F3}ms");
        }
    }
}

[System.Diagnostics.Conditional("UNITY_EDITOR")]
public static class DebugHelper
{
    public static void DrawCharacterInfo(CharacterData character)
    {
        if (character == null) return;
        
        DebugManager.Instance.SetDebugValue("Character Name", character.characterName);
        DebugManager.Instance.SetDebugValue("Age", character.currentAge);
        DebugManager.Instance.SetDebugValue("Intelligence", character.attributes.intelligence);
        DebugManager.Instance.SetDebugValue("Constitution", character.attributes.constitution);
    }
    
    public static void DrawGameState(GameManager.GameState state)
    {
        DebugManager.Instance.SetDebugValue("Game State", state.ToString());
    }
}
```

---

## 附录

### A. Unity项目设置

#### A.1 项目配置
- **Unity版本**: 2022.3 LTS
- **目标平台**: Windows, macOS, Android, iOS
- **渲染管线**: Universal Render Pipeline (URP)
- **脚本运行时**: .NET Standard 2.1

#### A.2 构建设置
- **压缩格式**: LZ4HC (最佳压缩比)
- **脚本优化**: IL2CPP + 高级优化
- **资源压缩**: 启用纹理压缩和音频压缩

### B. 开发规范

#### B.1 代码规范
- 使用C#命名约定（PascalCase、camelCase）
- 每个类文件只包含一个公共类
- 使用清晰的注释和XML文档
- 遵循SOLID原则

#### B.2 资源规范
- 纹理：使用合适的压缩格式，最大分辨率1024x1024
- 音频：使用压缩格式，循环音乐使用OGG，音效使用WAV
- 预制体：合理使用变体系统，避免重复资源

### C. 版本历史

- **v1.0** (2025-01-26)：初版前端技术设计文档完成

---

*本文档为《重启人生》游戏前端技术设计文档，专注于Unity客户端的技术架构和实现方案。* 