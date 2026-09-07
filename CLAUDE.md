@AGENTS.md
## Kod keşfi

Bu projede codebase-memory-mcp kurulu ve indexli. Kod ararken:

1. Önce `search_graph` / `semantic_query` ile sembolü bul — grep'le dosya tarama.
2. Bağımlılıkları anlamak için `trace_path` kullan.
3. Kodu `get_code_snippet` ile fonksiyon bazında al. Tam dosya okumayı yalnızca
   dosyanın tamamını değiştirecekseniz yap.
4. Değişiklik bitince `detect_changes` ile etkilenen sembolleri ve riski raporla.

Özellikle 400+ satırlık ekran dosyalarını (ProgramlarimScreen, PlanDetailScreen,
CreatePlanScreen, AppTabs) baştan sona okuma — ilgili fonksiyonu snippet olarak çek.