from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "PARALLAX"
    app_env: str = "development"
    debug: bool = True

    nebius_api_key: str
    nebius_base_url: str = "https://api.tokenfactory.nebius.com/v1/"

    nemotron_lightning_model: str
    nemotron_nano_model: str
    nemotron_super_model: str
    nemotron_ultra_model: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()