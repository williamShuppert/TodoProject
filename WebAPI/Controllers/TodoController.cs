using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly IDbContext _db;

        public TodoController(IDbContext db)
        {
            _db = db;
        }

        [Authorize]
        [HttpGet("Lists/{id}")]
        public async Task<ActionResult<TodoList>> GetList(int id)
        {
            var list = (await _db.Query<TodoList, object>("spGetList", new { listId = id })).FirstOrDefault();
            var userId = int.Parse(User.Claims.First(claim => claim.Type == "Id").Value);
            if (list == null || list.OwnerId != userId) return Forbid();
            return Ok(list);
        }

        [Authorize]
        [HttpGet("Lists")]
        public async Task<ActionResult<IEnumerable<TodoList>>> GetLists()
        {
            var userId = int.Parse(User.Claims.First(claim => claim.Type == "Id").Value);
            var lists = await _db.Query<TodoList, object>("spGetLists", new { ownerId = userId });
            if (lists.First().OwnerId != userId) return Forbid();
            return Ok(lists);
        }

        [Authorize]
        [HttpGet("Lists/{id}/Items")]
        public async Task<ActionResult<IEnumerable<TodoListItem>>> GetListItems(int id)
        {
            var userId = int.Parse(User.Claims.First(claim => claim.Type == "Id").Value);
            var results = await _db.QueryWithTwoReturns<TodoListItem, SprocAttempt, object>("spGetItems", new { listId = id, reqUserId = userId });
            if (!results.Item2.First().Success) return Forbid();
            return Ok(results.Item1);
        }

        [Authorize]
        [HttpPost("Lists/{id}/Items")]
        public async Task<ActionResult<int>> AddListItem(int id, AddTodoListItem todoItem)
        {
            var userId = int.Parse(User.Claims.First(claim => claim.Type == "Id").Value);

            var itemId = (await _db.Query<int, object>("spAddItem", new { 
                listId = id, content = todoItem.Content, displayOrder = todoItem.DisplayOrder, reqUserId = userId
            })).First();

            return itemId == -1 ? Forbid() : Ok(itemId);
        }

        [Authorize]
        [HttpPatch("Lists/{listId}/Items/{id}")]
        public async Task<IActionResult> AddListItem(int listId, int id, AddTodoListItem todoItem)
        {
            var userId = int.Parse(User.Claims.First(claim => claim.Type == "Id").Value);

            var attempt = (await _db.Query<SprocAttempt, object>("spUpdateItem", new {
                id = id,
                content = todoItem.Content,
                displayOrder = todoItem.DisplayOrder,
                isComplete = todoItem.IsComplete,
                reqUserId = userId
            })).First();

            return attempt.Success ? Ok() : Forbid();
        }

        [Authorize]
        [HttpDelete("Lists/{listId}/Items/{id}")]
        public async Task<IActionResult> DeleteListItem(int listId, int id)
        {
            var userId = int.Parse(User.Claims.First(claim => claim.Type == "Id").Value);
            var attempt = (await _db.Query<SprocAttempt, object>("spDeleteItem", new { id, reqUserId = userId, listId })).First();
            return attempt.Success ? Ok() : Forbid();
        }

        [Authorize]
        [HttpPost("Lists")]
        public async Task<ActionResult<TodoList>> PostList(AddList addList)
        {
            var userId = User.Claims.First(claim => claim.Type == "Id").Value;
            var list = (await _db.Query<TodoList, object>("spAddList", new { ownerId = userId, name = addList.name })).First();
            return Ok(list);
        }

        [Authorize]
        [HttpPatch("Lists/{id}")]
        public async Task<IActionResult> PatchList(AddList updateList, int id)
        {
            var userId = User.Claims.First(claim => claim.Type == "Id").Value;
            await _db.Execute<object>("spUpdateList", new { ownerId = userId, name = updateList.name, listId = id });
            return Ok();
        }

        [Authorize]
        [HttpDelete("Lists/{id}")]
        public async Task<IActionResult> DeleteList(int id)
        {
            var userId = int.Parse(User.Claims.First(claim => claim.Type == "Id").Value);
            var attempt = (await _db.Query<SprocAttempt, object>("spDeleteList", new { listId = id, ownerId = userId })).First();
            return attempt.Success ? Ok() : Forbid();
        }
    }
}
