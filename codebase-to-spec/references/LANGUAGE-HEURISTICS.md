# Language-Specific Extraction Heuristics

> Quick-reference for language-specific patterns to find during extraction. Use during Phase 1 (Structural Cartography) and Phase 2 (Behavioral Extraction).

---

## Rust

### Public API Detection
```
pub fn           → Public function
pub(crate) fn    → Crate-internal function (include in module-targeted)
pub struct       → Public data type
pub enum         → Public enum (often state machines)
pub trait        → Public interface contract
pub type         → Type alias (often for Result types)
pub const/static → Public constants
```

### Data Model Markers
```
#[derive(Serialize, Deserialize)]  → API/wire types
#[derive(sqlx::FromRow)]          → Database model
#[derive(Clone, Debug)]           → Domain types
struct {name} { fields }          → Core data model
enum {Name}                       → States, variants, or errors
```

### Error Model
```
#[derive(Error, Debug)]   → Custom error type (thiserror)
enum {Name}Error           → Error enum
Result<T, E>              → Fallible operation
.map_err(|e| ...)         → Error conversion
?                         → Error propagation
anyhow::Result            → Generic error (less typed)
```

### State Machines
```
enum Status { Pending, Active, Completed }  → State type
match self.status {                         → Transition logic
    Status::Pending => ...                  → Guard/action per state
}
```

### Concurrency
```
async fn              → Async function
tokio::spawn          → Task spawning
Arc<Mutex<T>>         → Shared mutable state
mpsc::channel         → Message passing
RwLock                → Read-write lock
tokio::select!        → Concurrent waiting
```

### Configuration
```
std::env::var("NAME")     → Environment variable
#[serde(default)]         → Config with defaults
config::Config::builder() → Config file loading
clap::Parser              → CLI arguments
```

### Entry Points
```
#[tokio::main]              → Application entry
fn main()                   → Sync entry
#[actix_web::main]          → Web server entry
#[test]                     → Test (documents behavior)
mod tests { ... }           → Test module
```

### Search Patterns
```
Glob: **/*.rs
Grep for public API: "pub fn|pub struct|pub enum|pub trait"
Grep for errors: "#\[derive.*Error|Result<|map_err|\.context\("
Grep for tests: "#\[test\]|#\[tokio::test\]"
Grep for routes: "\.route\(|\.get\(|\.post\(|#\[get|#\[post"
```

---

## TypeScript / JavaScript

### Public API Detection
```
export function      → Public function
export default       → Module's primary export
export class         → Public class
export interface     → Public type contract
export type          → Public type alias
export const         → Public constant
export enum          → Public enum
```

### Data Model Markers
```
interface {Name} { }              → Type definition
type {Name} = { }                 → Type alias
z.object({ })                    → Zod schema (validation + type)
Joi.object({ })                  → Joi schema
@Entity() class                  → TypeORM entity
const schema = pgTable('', {})   → Drizzle schema
mongoose.Schema({ })             → Mongoose model
@Column() field                  → Database column
```

### Error Model
```
class {Name}Error extends Error   → Custom error
throw new Error(...)              → Error throw
try { } catch (e) { }            → Error handling
.catch(err => ...)                → Promise error handling
if (!result.ok)                   → Result pattern
```

### State Machines
```
type Status = 'pending' | 'active' | 'completed'  → State union
enum Status { Pending, Active }                    → State enum
useState<Status>()                                 → React state
switch (status) { case 'pending': ... }            → Transition logic
```

### React-Specific (Frontend)
```
useState()          → Local component state
useEffect()         → Side effects / lifecycle
useContext()        → Shared context state
useReducer()       → Complex state with transitions
useMemo/useCallback → Performance optimization
Custom hooks: use{Name}() → Reusable state logic
```

### Concurrency
```
async/await          → Async operations
Promise.all()        → Parallel execution
Promise.race()       → First-to-complete
setTimeout()         → Delayed execution
setInterval()        → Recurring execution
Worker/SharedWorker  → Web workers
```

### Configuration
```
process.env.{NAME}     → Environment variable
import config from      → Config module
dotenv.config()         → .env file loading
next.config.js          → Framework config
```

### Entry Points
```
app.listen()              → Server start
createServer()            → HTTP server
export default function   → Next.js page/API route
app.get('/', handler)     → Route definition
router.post('/', handler) → Router route
addEventListener()        → Event handler
```

### Search Patterns
```
Glob: **/*.{ts,tsx,js,jsx}
Grep for exports: "export (function|class|interface|type|const|default)"
Grep for routes: "app\.(get|post|put|delete|patch)\(|router\."
Grep for hooks: "use[A-Z][a-zA-Z]+\("
Grep for schemas: "z\.object|Joi\.object|pgTable|mongoose\.Schema"
Grep for errors: "throw new|\.catch\(|try \{"
```

---

## Python

### Public API Detection
```
def function_name()       → Public function (no underscore prefix)
class ClassName:           → Public class
__all__ = [...]           → Explicit exports
@app.route()              → Flask/FastAPI endpoint
@router.get()             → FastAPI router
```

### Data Model Markers
```
class {Name}(BaseModel):    → Pydantic model
@dataclass                  → Data class
class {Name}(Base):         → SQLAlchemy model
class {Name}(models.Model): → Django model
TypedDict                   → Typed dictionary
NamedTuple                  → Typed tuple
```

### Error Model
```
class {Name}Error(Exception):  → Custom exception
raise {Name}Error(...)         → Error raising
try: / except:                 → Error handling
@app.exception_handler()       → Global error handler
```

### Configuration
```
os.environ.get('NAME')     → Environment variable
settings.py                → Django settings
config.py                  → Config module
pydantic.BaseSettings      → Typed settings
```

### Entry Points
```
if __name__ == '__main__':   → Script entry
app = FastAPI()              → ASGI app
app = Flask(__name__)        → WSGI app
@celery_app.task             → Background task
@app.command()               → CLI command (Click/Typer)
```

### Search Patterns
```
Glob: **/*.py
Grep for routes: "@(app|router)\.(get|post|put|delete|patch)"
Grep for models: "class.*BaseModel|@dataclass|class.*models\.Model"
Grep for errors: "class.*Exception|raise |except "
Grep for tests: "def test_|class Test|@pytest"
```

---

## Go

### Public API Detection
```
func FunctionName()    → Exported function (capitalized)
type TypeName struct   → Exported struct
type InterfaceName interface → Exported interface
var VarName            → Exported variable
const ConstName        → Exported constant
```

### Data Model Markers
```
type {Name} struct { }           → Data type
json:"field_name"                → JSON serialization tag
db:"column_name"                 → Database mapping tag
validate:"required,min=1"        → Validation tag
gorm:"primaryKey"                → GORM ORM tag
```

### Error Model
```
errors.New("message")        → Simple error
fmt.Errorf("wrap: %w", err) → Wrapped error
type {Name}Error struct { }  → Custom error type
func (e *{Name}Error) Error() string → Error interface
if err != nil { return err } → Error propagation (idiomatic)
```

### Concurrency
```
go func() { }()           → Goroutine
chan T                     → Channel
sync.Mutex                → Mutex
sync.WaitGroup            → Wait group
select { case <-ch: }     → Channel select
context.WithTimeout()     → Cancellation
```

### Entry Points
```
func main()                  → Application entry
http.HandleFunc("/", h)      → HTTP route
r.GET("/path", handler)      → Gin route
e.GET("/path", handler)      → Echo route
mux.HandleFunc("/", h)       → Chi/gorilla route
```

### Search Patterns
```
Glob: **/*.go
Grep for exports: "^func [A-Z]|^type [A-Z]"
Grep for routes: "HandleFunc|\.GET\(|\.POST\(|\.Handle\("
Grep for errors: "errors\.New|fmt\.Errorf|if err != nil"
Grep for tests: "func Test|func Benchmark"
```

---

## Java / Kotlin

### Public API Detection
```
public class/interface/enum    → Public type
public {return} {method}()     → Public method
@RestController                → REST API class
@GetMapping/@PostMapping       → REST endpoint
@Service/@Component            → Spring bean
```

### Data Model Markers
```
@Entity                    → JPA entity
@Table(name = "")          → Database table
@Column                    → Database column
record {Name}()            → Java record (immutable data)
data class {Name}()        → Kotlin data class
@JsonProperty              → JSON mapping
```

### Error Model
```
class {Name}Exception extends RuntimeException  → Custom exception
throw new {Name}Exception()                     → Exception throwing
try { } catch (Type e) { }                      → Exception handling
@ExceptionHandler                               → Spring error handler
@ControllerAdvice                               → Global error handling
```

### Entry Points
```
public static void main(String[] args)  → Application entry
@SpringBootApplication                  → Spring Boot app
@RestController                         → REST controller
@Scheduled                              → Scheduled task
@KafkaListener                          → Message listener
```

### Search Patterns
```
Glob: **/*.{java,kt}
Grep for API: "@(Get|Post|Put|Delete|Patch)Mapping|@RequestMapping"
Grep for entities: "@Entity|@Table|data class"
Grep for errors: "extends.*Exception|throw new|@ExceptionHandler"
Grep for tests: "@Test|@ParameterizedTest"
```

---

## C / C++

### Public API Detection
```
// Header files define public API
.h / .hpp files        → Public interface declarations
extern "C" { }         → C-compatible API surface
__declspec(dllexport)  → Windows DLL exports
__attribute__((visibility("default"))) → Linux shared lib exports
class {Name} { public: } → Public class methods
namespace {Name} { }   → Namespace-scoped API
```

### Data Model Markers
```
struct {Name} { }              → C-style data type
class {Name} { }               → C++ class
enum class {Name} { }          → Scoped enum (C++11+)
typedef struct { } {Name};     → C typedef pattern
using {Alias} = {Type};        → C++ type alias
```

### Error Model
```
errno                       → C error code
std::error_code             → C++ system error
throw std::runtime_error()  → C++ exception
try { } catch (...) { }     → Exception handling
return -1; / return NULL;   → C error return pattern
std::expected<T, E>         → C++23 Result type
```

### Concurrency
```
std::thread              → Thread creation
std::mutex               → Mutex lock
std::atomic<T>           → Atomic operations
std::condition_variable  → Condition variable
pthread_create           → POSIX threads
#pragma omp              → OpenMP parallelism
```

### Configuration
```
getenv("NAME")           → Environment variable
#define CONFIG_VALUE      → Compile-time config
constexpr auto value     → Compile-time constant
.ini / .cfg files        → Runtime config files
```

### Entry Points
```
int main(int argc, char* argv[])  → Application entry
DllMain()                          → Windows DLL entry
__attribute__((constructor))       → Library init (GCC)
```

### Search Patterns
```
Glob: **/*.{c,cpp,cc,cxx,h,hpp,hxx}
Grep for public API: "^(extern|__declspec|class.*public:|namespace)"
Grep for errors: "throw |catch |errno|std::error"
Grep for tests: "TEST\\(|TEST_F\\(|BOOST_AUTO_TEST|CATCH_TEST_CASE"
```

---

## Ruby

### Public API Detection
```
def method_name          → Public method (default visibility)
class ClassName          → Class definition
module ModuleName        → Module (namespace/mixin)
attr_accessor :field     → Public attribute
private / protected      → Visibility boundary (methods below are non-public)
```

### Data Model Markers
```
class {Name} < ApplicationRecord  → Rails Active Record model
has_many / belongs_to / has_one   → Model associations
validates :field, {rules}         → Model validations
Struct.new(:field1, :field2)      → Struct definition
```

### Error Model
```
class {Name}Error < StandardError  → Custom exception
raise {Name}Error, "message"      → Exception raising
begin / rescue / ensure           → Exception handling
rescue_from {Error}               → Rails controller error handling
```

### Configuration
```
ENV['NAME']               → Environment variable
Rails.configuration       → Rails config
config/settings.yml       → Settings file
```

### Entry Points
```
Rails.application.routes  → Rails routes
config.ru                 → Rack application entry
bin/rails server          → Server start
Rake::Task                → Task definition
```

### Search Patterns
```
Glob: **/*.rb
Grep for routes: "get '|post '|put '|delete '|resources |resource "
Grep for models: "class.*ApplicationRecord|has_many|belongs_to|validates"
Grep for errors: "class.*Error|raise |rescue "
Grep for tests: "describe |context |it '|test '|def test_"
```

---

## Other Languages — Generic Fallback

For languages not listed above, use these universal heuristics:

### Finding Public APIs
```
Look for:
1. Visibility modifiers: public, export, pub, extern
2. Header/interface files (separate from implementation)
3. Module index files (index.*, mod.*, __init__.*)
4. Route/handler registrations
5. Documentation comments on functions (///, /**, #, """)
```

### Finding Data Models
```
Look for:
1. Struct/class definitions with multiple fields
2. Database migration/schema files
3. Serialization annotations (JSON, XML, protobuf)
4. Validation decorators/annotations
5. ORM model definitions
```

### Finding Errors
```
Look for:
1. Custom exception/error class definitions
2. Try/catch/rescue/except blocks
3. Error code constants
4. Error handling middleware/interceptors
```

### Finding Tests
```
Look for:
1. Files matching: *test*, *spec*, *_test.*, *.test.*
2. Test framework imports (assert, expect, should)
3. Test runner configurations
```

**If you encounter an unfamiliar language:** Read 3-5 representative files first to learn its conventions before launching extraction agents. Document the language-specific patterns you discover in Phase 0 scope notes.

---

## Universal Patterns (All Languages)

### Finding Entry Points
```
Grep for: "main|listen|serve|start|boot|init|run"
Look for: Framework-specific server startup
Check: package.json scripts, Makefile, Dockerfile CMD/ENTRYPOINT
```

### Finding Tests (Document Behavior)
```
Glob for: **/*test*|**/*spec*|**/__tests__/**
Tests are GOLD for extraction — they document expected behavior explicitly
Priority: integration tests > unit tests > e2e tests (for spec extraction)
```

### Finding Configuration
```
Glob for: **/.env*|**/config.*|**/*.toml|**/*.yaml|**/*.yml
Grep for: "env|config|setting|option|flag|feature"
```

### Finding Documentation
```
Glob for: **/README*|**/ARCHITECTURE*|**/DESIGN*|**/docs/**
Also check: inline doc comments (/// in Rust, /** */ in JS/Java, """ in Python)
```
